
import Link from 'next/link';
import Image from "next/image";
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Menu, BookCopy } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const LegalHeader = () => (
    <header className="sticky top-0 z-50 flex justify-between items-center p-4 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <Image
                src="https://drive.google.com/uc?export=view&id=1Xml9oa7fXxInG122MonM9niKrPtsSTzf"
                alt="ReadmeBuddy Logo"
                width={32}
                height={32}
                className="h-8 w-8"
            />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 dark:from-white dark:to-gray-400 to-gray-400 tracking-wide">
                ReadmeBuddy
            </span>
        </Link>
        <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center gap-2">
                 <Button asChild variant="ghost">
                    <Link href="/">Home</Link>
                </Button>
                <Button asChild variant="ghost">
                    <Link href="/posts">Blog</Link>
                </Button>
            </nav>
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                         <SheetHeader>
                           <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                        </SheetHeader>
                        <nav className="flex flex-col gap-4 mt-8">
                            <Link href="/" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
                            <Link href="/posts" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
                            <Link href="/about" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">About</Link>
                            <Link href="/privacy" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
                            <Link href="/terms" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
            <ThemeToggle />
        </div>
    </header>
);

const CommandSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <section className="mb-12">
        <h2 className="text-3xl font-bold border-b pb-2 mb-6">{title}</h2>
        <div className="space-y-8">
            {children}
        </div>
    </section>
);

const Command = ({ cmd, description }: { cmd: string, description: string }) => (
    <div>
        <pre className="bg-secondary text-secondary-foreground rounded-md p-4 my-2 overflow-x-auto"><code className="font-mono text-sm">{cmd}</code></pre>
        <p className="text-muted-foreground mt-2 text-base">{description}</p>
    </div>
);


export default function LearnGitPage() {
    return (
        <>
            <LegalHeader />
            <main className="container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <BookCopy className="mx-auto h-16 w-16 text-primary mb-4" />
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Learn Git Commands</h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">A quick reference guide for the most common Git commands and use cases.</p>
                    </div>

                    <div className="prose dark:prose-invert prose-lg max-w-none">
                        <CommandSection title="⚙️ Setup & Configuration">
                            <Command cmd="git config --global user.name 'Your Name'" description="Set the name that will be attached to your commits." />
                            <Command cmd="git config --global user.email 'youremail@example.com'" description="Set the email that will be attached to your commits." />
                            <Command cmd="git config --global init.defaultBranch main" description="Set the default branch name to 'main' for new repositories." />
                        </CommandSection>

                        <CommandSection title="🚀 Starting a Project">
                            <Command cmd="git init" description="Initialize a new, empty Git repository in the current directory." />
                            <Command cmd="git clone https://github.com/user/repo.git" description="Create a local copy of a remote repository." />
                        </CommandSection>
                        
                        <CommandSection title="🛠️ Daily Workflow">
                            <Command cmd="git status" description="Show the working tree status (untracked, modified, and staged files)." />
                            <Command cmd="git add <file>" description="Add file contents to the index (staging area). Use `git add .` to add all changes." />
                            <Command cmd="git commit -m 'Your commit message'" description="Record changes to the repository with a descriptive message." />
                            <Command cmd="git push" description="Update the remote repository with your committed changes." />
                            <Command cmd="git pull" description="Fetch changes from the remote repository and merge them into your current branch." />
                        </CommandSection>

                        <CommandSection title="🌿 Branching & Merging">
                            <Command cmd="git branch" description="List all local branches. Add `-r` for remote or `-a` for all branches." />
                            <Command cmd="git branch <branch-name>" description="Create a new branch." />
                            <Command cmd="git checkout <branch-name>" description="Switch to an existing branch. Use `-b` to create and switch to a new branch in one step (`git checkout -b <new-branch>`)." />
                            <Command cmd="git merge <branch-name>" description="Join the specified branch's history into the current branch." />
                            <Command cmd="git rebase <branch-name>" description="Re-apply commits from your current branch onto the tip of another branch, creating a cleaner, linear history." />
                        </CommandSection>

                        <CommandSection title="⏪ Undoing Changes">
                             <Command cmd="git commit --amend" description="Modify the most recent commit. Useful for fixing typos in the commit message or adding forgotten changes." />
                            <Command cmd="git reset HEAD <file>" description="Unstage a file, but preserve its content in the working directory." />
                            <Command cmd="git reset --soft HEAD~1" description="Undo the last commit but keep the changes staged." />
                            <Command cmd="git reset --hard HEAD~1" description="DANGEROUS: Discard the last commit and all changes in the working directory. Use with caution." />
                            <Command cmd="git revert <commit-hash>" description="Create a new commit that undoes the changes of a previous commit, safely preserving history." />
                        </CommandSection>

                        <CommandSection title="🔎 Inspecting History">
                            <Command cmd="git log" description="Show the commit history. Use `--oneline` for a compact view." />
                            <Command cmd="git log --graph --oneline --decorate" description="Display the commit history as a visual graph." />
                            <Command cmd="git diff" description="Show changes between commits, commit and working tree, etc. `git diff --staged` shows changes in the staging area." />
                            <Command cmd="git show <commit-hash>" description="Show metadata and content changes of the specified commit." />
                        </CommandSection>

                         <CommandSection title="🤝 Working with Remotes">
                            <Command cmd="git remote -v" description="List all remote repositories." />
                            <Command cmd="git remote add origin <url>" description="Add a new remote repository." />
                            <Command cmd="git fetch origin" description="Download objects and refs from another repository without merging." />
                            <Command cmd="git push -u origin main" description="Push a local branch to a remote repository and set it as the upstream branch." />
                        </CommandSection>
                    </div>
                </div>
            </main>
        </>
    );
}
