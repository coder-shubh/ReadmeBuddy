
import Link from 'next/link';
import Image from "next/image";
import { Zap, Rocket, Heart, BookOpen, Shield, Star, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
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
                            <Link href="/posts" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
                            <Link href="/learn-git" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Learn Git</Link>
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

const ValueCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
        <div className="flex items-center justify-center text-primary mb-3">
            {icon}
        </div>
        <h4 className="font-semibold text-lg mb-2 text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground">{children}</p>
    </div>
);

export default function AboutPage() {
    return (
        <>
            <LegalHeader />
            <main className="container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12 sm:mb-20">
                        <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-700 dark:from-white light:text-slate-900 dark:to-gray-400">
                            About Us
                        </h1>
                        <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto [text-wrap:balance]">
                            We believe that great projects deserve great documentation. ReadmeBuddy was born from the idea that creating a professional README shouldn't be a chore. Our mission is to empower developers to focus on what they do best—building amazing software—while we handle the documentation.
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
                        <div className="space-y-6 text-muted-foreground">
                            <h3 className="text-2xl font-bold text-foreground">🚀 Founded in 2025</h3>
                            <p>
                                ReadmeBuddy started as a developer-side project to solve a common pain point: spending hours crafting README files when you'd rather be coding. Today, it's a time-saving tool trusted by developers who want clear, professional documentation—fast.
                            </p>
                            <h3 className="text-2xl font-bold text-foreground">💡 What We Do</h3>
                            <p>
                                We analyze your GitHub repo or local codebase and instantly generate a polished, Markdown-formatted README.md. From project overviews and tech stacks to setup instructions and usage examples—we handle the writing so you don’t have to.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-center text-foreground mb-6">🌟 Our Core Values</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <ValueCard icon={<Zap size={24} />} title="Simplicity">Easy to use with zero learning curve.</ValueCard>
                                <ValueCard icon={<Rocket size={24} />} title="Efficiency">Save hours by automating grunt work.</ValueCard>
                                <ValueCard icon={<Heart size={24} />} title="Developer-Friendly">Built by developers, for developers.</ValueCard>
                                <ValueCard icon={<BookOpen size={24} />} title="Clarity">Help projects stand out with clean docs.</ValueCard>
                                <ValueCard icon={<Shield size={24} />} title="Privacy First">We never store your code.</ValueCard>
                                <ValueCard icon={<Star size={24} />} title="Quality">Professional, polished results, always.</ValueCard>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
