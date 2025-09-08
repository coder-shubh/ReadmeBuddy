
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
                            <Link href="/terms" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
            <ThemeToggle />
        </div>
    </header>
);

export default function PrivacyPage() {
    return (
        <>
            <LegalHeader />
            <main className="container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
                    <p className="text-sm text-muted-foreground mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    
                    <div className="space-y-6 prose dark:prose-invert prose-lg max-w-none">
                        <section>
                            <h2 className="text-2xl font-semibold">1. Introduction</h2>
                            <p>Welcome to ReadmeBuddy ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and disclose your information when you use our website and services (collectively, the "Service"). By using the Service, you agree to the collection and use of information in accordance with this policy.</p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
                            <p>We are committed to user privacy and collect minimal data necessary to provide our service.</p>
                             <ul className="list-disc pl-6">
                                <li><strong>Repository and Code Data:</strong> When you provide a public GitHub repository URL or upload a local folder, we access the code and file structure for the sole purpose of analysis and README generation. This data is processed in-memory on our servers and is **never stored, logged, or saved** after the generation process is complete. Your code remains your own.</li>
                                <li><strong>Analytics Data:</strong> We use Firebase Analytics to collect anonymous usage data to help us understand how our Service is used. This includes information like page views, feature usage (e.g., clicks on "Generate from URL"), browser type, and operating system. This data is aggregated and cannot be used to personally identify you.</li>
                             </ul>
                        </section>
                        <section>
                            <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
                            <p>The information we collect is used for the following purposes:</p>
                             <ul className="list-disc pl-6">
                                <li><strong>To Provide and Maintain our Service:</strong> Your repository data is used exclusively to generate the README.md file.</li>
                                <li><strong>To Improve our Service:</strong> Anonymous analytics data helps us understand user behavior, identify popular features, and improve the overall user experience.</li>
                                <li><strong>To Provide Advertising:</strong> We use Google AdSense to display ads, which helps keep our service free.</li>
                            </ul>
                        </section>
                        <section>
                            <h2 className="text-2xl font-semibold">4. Advertising and Cookies</h2>
                             <p>We use third-party advertising companies, like Google AdSense, to serve ads when you visit our website. These companies may use information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.</p>
                            <p>Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to our sites and/or other sites on the Internet.</p>
                            <p>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">www.aboutads.info/choices</a>.</p>
                            <p>You can also choose to disable or selectively turn off our cookies or third-party cookies in your browser settings. However, this can affect how you are able to interact with our site as well as other websites.</p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-semibold">5. Data Security</h2>
                            <p>We are committed to ensuring that your information is secure. We use industry-standard security measures to protect against the loss, misuse, and alteration of data. As we do not store any source code or personally identifiable information from your repositories, the risk of data exposure is minimized. All processing happens on-the-fly and is ephemeral.</p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-semibold">6. Third-Party Services</h2>
                            <p>We use third-party services like GitHub's API for fetching repository data and Google/Firebase for analytics and hosting. We are not responsible for the privacy practices of these third-party services. We encourage you to review their privacy policies.</p>
                        </section>
                         <section>
                            <h2 className="text-2xl font-semibold">7. Children's Privacy</h2>
                            <p>Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If we become aware that we have collected Personal Data from a child under 13 without verification of parental consent, we take steps to remove that information from our servers.</p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-semibold">8. Changes to This Privacy Policy</h2>
                            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-semibold">9. Contact Us</h2>
                            <p>If you have any questions about this Privacy Policy, please contact us via our official support channels listed on our website.</p>
                        </section>
                    </div>
                </div>
            </main>
        </>
    );
}
