
"use client"

import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Copy, Check, Download, FolderGit2 } from "lucide-react"
import { marked } from "marked"
import { doc, runTransaction, increment } from "firebase/firestore";
import { db, analytics } from "@/lib/firebase";
import { logEvent } from "firebase/analytics";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { getRepoInfoAction } from "@/app/actions"
import { getRepoFileTree, getFileContent } from "@/lib/github"
import { assembleReadme } from "@/lib/readme-generator"
import { enhanceDescription } from '@/ai/flows/enhance-description';
import { Adsense } from "./adsense"

const FormSchema = z.object({
  inputPath: z.string().url({ message: "Please enter a valid GitHub URL." }).optional().or(z.literal('')),
})

// Type for modern File System Access API
type FileSystemHandle = any;
async function getFilesRecursively(entry: FileSystemHandle, path: string = ''): Promise<{ path: string, handle: FileSystemHandle }[]> {
  const files: { path: string, handle: FileSystemHandle }[] = [];
  if (entry.kind === 'file') {
    files.push({ path: path + entry.name, handle: entry });
  } else if (entry.kind === 'directory') {
    for await (const handle of entry.values()) {
      files.push(...await getFilesRecursively(handle, path + entry.name + '/'));
    }
  }
  return files;
}

export function ReadmeForm() {
  const [rawReadme, setRawReadme] = useState("")
  const [renderedReadme, setRenderedReadme] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Generating...")
  const [copied, setCopied] = useState(false)
  const [localPath, setLocalPath] = useState<string | null>(null);
  const legacyFolderInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      inputPath: "",
    },
  })

const incrementClickCount = async (buttonId: 'url' | 'local') => {
  if (!db) return;
  const docRef = doc(db, 'clickMetrics', buttonId);

  try {
    await runTransaction(db, async (transaction) => {
      const sfDoc = await transaction.get(docRef);
      if (!sfDoc.exists()) {
        transaction.set(docRef, { count: 1 });
      } else {
        transaction.update(docRef, { count: increment(1) });
      }
    });
  } catch (e) {
    console.error("Transaction failed: ", e);
  }
};
  
  const handleGenerationError = (error: unknown, title: string = "Generation Failed") => {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
      toast({
        variant: "destructive",
        title: title,
        description: errorMessage,
      })
      console.log(error)
  }

  const generateAndSetReadme = async (params: Omit<Parameters<typeof assembleReadme>[0], 'ai'>) => {
    try {
      const readme = await assembleReadme({
        ...params,
        ai: { enhanceDescription }
      });
      setRawReadme(readme);
      const html = await marked.parse(readme);
      setRenderedReadme(html);
      toast({
        title: "Success!",
        description: "Your README has been generated.",
      });
    } catch (error) {
      handleGenerationError(error);
    }
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true)
    setRawReadme("")
    setRenderedReadme("")
    setLoadingMessage("Fetching repository details...");
    
    try {
        if (analytics) {
            logEvent(analytics, "generate_from_url");
        }
        await incrementClickCount('url');

        if (!data.inputPath) {
            toast({
                variant: "destructive",
                title: "No URL provided",
                description: "Please enter a GitHub repository URL to generate a README.",
            });
            setIsLoading(false);
            return;
        }

        const repoInfoResult = await getRepoInfoAction(data);
        if (!repoInfoResult.success || !repoInfoResult.repoInfo) {
            toast({ variant: "destructive", title: "Failed to Fetch Details", description: repoInfoResult.error });
            setIsLoading(false);
            return;
        }
        
        const { owner, repo, description: initialDescription, defaultBranch } = repoInfoResult.repoInfo;

        setLoadingMessage("Analyzing file structure...");
        const fileTree = await getRepoFileTree(owner, repo, defaultBranch);
        if (!fileTree) {
            throw new Error("Could not fetch repository file tree. The repository might be empty or the branch does not exist.");
        }

        const fileList = fileTree.map((file: any) => file.path);
        const getFileContentFn = (path: string) => getFileContent(owner, repo, path);

        setLoadingMessage("Generating README with our system...");
        await generateAndSetReadme({
            name: repo,
            fileList,
            getFileContentFn,
            initialDescription,
            repoUrl: data.inputPath,
        });
    } catch (error) {
        handleGenerationError(error);
    } finally {
        setIsLoading(false)
        setLocalPath(null);
    }
  }

const handleLocalFolderSelect = async () => {
    // Increment click count *after* the file picker is initiated or in a non-blocking way
    // if it absolutely must happen before processing the files.

    // 1. Immediately initiate the file picker based on browser support.
    // This part MUST happen synchronously after the user click, before any awaits.
    if ('showDirectoryPicker' in window) {
      try {
        // This line is the critical one that needs to execute without an await before it
        const dirHandle = await (window as any).showDirectoryPicker(); 

        // Now that the picker is open/handled, you can safely await other operations.
        if (analytics) {
            logEvent(analytics, "select_local_folder");
        }
        await incrementClickCount('local'); // Now it's safe to await this

        setIsLoading(true);
        setRawReadme("");
        setRenderedReadme("");
        setLocalPath(dirHandle.name);
        form.reset({ inputPath: "" });

        setLoadingMessage("Scanning local directory...");
        const allFiles = await getFilesRecursively(dirHandle);
        const fileList = allFiles.map(f => f.path);
        
        const getFileContentFn = async (path: string): Promise<string | null> => {
          const fileHandle = allFiles.find(f => f.path === path)?.handle;
          if (fileHandle) {
            const file = await fileHandle.getFile();
            return file.text();
          }
          return null;
        };

        setLoadingMessage("Generating README with our system...");
        await generateAndSetReadme({
          name: dirHandle.name,
          fileList,
          getFileContentFn,
          initialDescription: ""
        });

      } catch (error: any) {
          if (error.name !== 'AbortError') { // User cancelled the picker
              handleGenerationError(error);
          }
      } finally {
          setIsLoading(false);
      }
    } else {
      // Fallback for Safari/other browsers (legacyFolderInputRef)
      if (legacyFolderInputRef.current) {
        // This line is also critical and needs to execute without an await before it
        legacyFolderInputRef.current.click();

        // Now that the click is initiated, you can safely await other operations
        if (analytics) {
            logEvent(analytics, "select_local_folder");
        }
        await incrementClickCount('local'); // Now it's safe to await this

        // The rest of the logic for processing files from legacyFolderInputRef
        // will be in handleLegacyFolderSelect, which is triggered by the input's change event.
        // So, no more awaits needed here.
      } else {
         toast({
          variant: "destructive",
          title: "Unsupported Browser",
          description: "Your browser does not support local directory access. Please use a modern browser like Chrome or Edge.",
        });
      }
    }
  }

  const handleLegacyFolderSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) {
        return;
      }
      
      try {
        setIsLoading(true);
        setRawReadme("");
        setRenderedReadme("");

        const fileArray = Array.from(files);
        // Try to determine the root folder name from the common base path.
        const firstPath = fileArray[0].webkitRelativePath;
        const rootDir = firstPath.split('/')[0];
        setLocalPath(rootDir);
        form.reset({ inputPath: "" });

        setLoadingMessage("Scanning local directory...");
        // In this legacy API, webkitRelativePath includes the root folder, so we don't need to prepend it.
        const fileList = fileArray.map(file => file.webkitRelativePath);
        
        const getFileContentFn = async (path: string): Promise<string | null> => {
            const file = fileArray.find(f => f.webkitRelativePath === path);
            return file ? file.text() : null;
        };

        setLoadingMessage("Generating README with our system...");
        await generateAndSetReadme({
            name: rootDir,
            fileList,
            getFileContentFn,
            initialDescription: ""
        });
      } catch(error: any) {
        handleGenerationError(error);
      } finally {
        setIsLoading(false);
        // Reset the input value to allow selecting the same folder again
        if(legacyFolderInputRef.current) {
          legacyFolderInputRef.current.value = "";
        }
      }
  }
  
  const handleCopy = () => {
    navigator.clipboard.writeText(rawReadme)
    setCopied(true)
    toast({ title: "Copied!", description: "README content copied to clipboard." });
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([rawReadme], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <div className="flex flex-col gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="inputPath"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-lg flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/></svg>
                      Public GitHub Repository URL
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="e.g., https://github.com/user/repo" 
                          {...field}
                          onChange={(e) => {
                              field.onChange(e);
                              if (e.target.value) setLocalPath(null);
                          }}
                          disabled={!!localPath}
                          className="pl-12 h-14 text-base sm:text-lg bg-background/70 border-border"
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      We only analyze public repositories. Your code is never stored.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <Button type="submit" disabled={isLoading || !!localPath} className="w-full h-14 sm:h-16 text-lg sm:text-xl font-bold">
              {isLoading && !localPath ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  {loadingMessage}
                </>
              ) : (
                "Generate from URL"
              )}
            </Button>
          </form>
        </Form>
        
        <div className="flex items-center gap-4">
            <div className="flex-grow border-t border-border"></div>
            <span className="text-muted-foreground text-sm">OR</span>
            <div className="flex-grow border-t border-border"></div>
        </div>

        {localPath && !isLoading && (
            <div className="flex items-center justify-center p-4 rounded-lg bg-secondary text-secondary-foreground gap-2">
                <FolderGit2 className="h-5 w-5" />
                <span className="font-medium">{localPath}</span>
            </div>
        )}
        
        <input
          type="file"
          ref={legacyFolderInputRef}
          onChange={handleLegacyFolderSelect}
          multiple
          // @ts-ignore
          webkitdirectory=""
          className="hidden"
        />

        <Button 
            variant="outline"
            onClick={handleLocalFolderSelect}
            disabled={isLoading}
            className="w-full h-14 sm:h-16 text-lg sm:text-xl font-bold"
        >
          {isLoading && localPath ? (
            <>
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              {loadingMessage}
            </>
          ) : (
            <>
             <FolderGit2 className="mr-2 h-6 w-6" />
             Select Local Folder
            </>
          )}
        </Button>

      </div>
      
      <div className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-code-2"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/><path d="m10 13-2 2 2 2"/><path d="m14 17 2-2-2-2"/></svg>
              Generated README
            </h3>
            {renderedReadme && !isLoading && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
                <Button size="sm" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          )}
          </div>
          
          <div className="bg-secondary/30 rounded-lg border border-border/50 p-4 sm:p-6 min-h-[400px] lg:min-h-full max-h-[40rem] lg:max-h-none overflow-y-auto w-full h-full">
            {isLoading && !renderedReadme && 
              <div className="flex flex-col justify-center items-center h-full text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">{loadingMessage}</p>
                <p className="text-sm text-muted-foreground/50">This may take a moment.</p>
              </div>
            }
            {!isLoading && !renderedReadme &&
              <div className="flex flex-col justify-center items-center h-full text-center">
                  <Adsense />
                  <p className="text-lg text-muted-foreground mt-4">Your generated README will appear here.</p>
              </div>
            }
            {renderedReadme && (
              <div 
                className="markdown-content" 
                dangerouslySetInnerHTML={{ __html: renderedReadme }} 
              />
            )}
          </div>
      </div>
    </div>
  )
}
