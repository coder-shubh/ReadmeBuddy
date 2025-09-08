
import Link from 'next/link';
import Image from "next/image";
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Menu } from 'lucide-react';
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
                    <Link href="/about">About</Link>
                </Button>
                <Button asChild variant="ghost">
                    <Link href="/posts">Blog</Link>
                </Button>
                <Button asChild variant="ghost">
                    <Link href="/learn-git">Learn Git</Link>
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
                            <Link href="/about" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">About</Link>
                            <Link href="/posts" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
                            <Link href="/learn-git" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Learn Git</Link>
                            <Link href="/privacy" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
            <ThemeToggle />
        </div>
    </header>
);

export default function TermsPage() {
    return (
        <>
            <LegalHeader />
            <main className="container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-6">Terms & Conditions</h1>
                    <p className="text-sm text-muted-foreground mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    
                    <div className="space-y-6 prose dark:prose-invert prose-lg max-w-none">
                        <section>
                            <h2 className="text-2xl font-semibold">1. Introduction</h2>
                            <p>Welcome to ReadmeBuddy! These terms and conditions outline the rules and regulations for the use of our website and services. By accessing this website, we assume you accept these terms and conditions. Do not continue to use ReadmeBuddy if you do not agree to all of the terms and conditions stated on this page.</p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-semibold">2. Intellectual Property Rights</h2>
                            <p>Other than the content you own, under these Terms, ReadmeBuddy and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted a limited license only for purposes of viewing and using the material contained on this Website.</p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-semibold">3. Restrictions</h2>
                            <p>You are specifically restricted from all of the following:</p>
                            <ul className="list-disc pl-6">
                                <li>publishing any Website material in any other media;</li>
                                <li>selling, sublicensing and/or otherwise commercializing any Website material;</li>
                                <li>publicly performing and/or showing any Website material;</li>
                                <li>using this Website in any way that is or may be damaging to this Website;</li>
                                <li>using this Website in any way that impacts user access to this Website;</li>
                                <li>using this Website contrary to applicable laws and regulations, or in any way may cause harm to the Website, or to any person or business entity;</li>
                                <li>engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website;</li>
                                <li>using this Website to engage in any advertising or marketing.</li>
                            </ul>
                        </section>
                        <section>
                            <h2 className="text-2xl font-semibold">4. Your Content</h2>
                            <p>In these Website Standard Terms and Conditions, “Your Content” shall mean any public GitHub repository URL or local code you provide for analysis. We do not claim ownership of your code. By using our service, you grant ReadmeBuddy a temporary, non-exclusive, worldwide, royalty-free license to process Your Content solely for the purpose of generating a README file. We do not store your code after the generation process is complete.</p>
                            <p>Your Content must be your own and must not be invading any third-party’s rights. ReadmeBuddy reserves the right to refuse service for any content at our discretion.</p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-semibold">5. Privacy Policy</h2>
                            <p>Your use of the Website is also governed by our Privacy Policy. Please review our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, which also governs the site and informs users of our data collection practices.</p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-semibold">6. No warranties</h2>
                            <p>This Website is provided “as is,” with all faults, and ReadmeBuddy expresses no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be interpreted as advising you.</p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-semibold">7. Limitation of liability</h2>
                            <p>In no event shall ReadmeBuddy, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. ReadmeBuddy, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.</p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-semibold">8. Governing Law & Jurisdiction</h2>
                            <p>These Terms will be governed by and interpreted in accordance with the laws of the jurisdiction of the website owner, and you submit to the non-exclusive jurisdiction of the state and federal courts located in that jurisdiction for the resolution of any disputes.</p>
                        </section>
                    </div>
                </div>
            </main>
        </>
    );
}
