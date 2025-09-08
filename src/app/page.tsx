
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from 'next/link';
import { ReadmeForm } from "@/components/readme-form";
import { getPosts } from "@/lib/posts";
import type { Post } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Code,
  BotMessageSquare,
  BookOpen,
  Sparkles,
  ArrowDown,
  Menu,
  Heart,
  Shield,
  Star,
  Zap,
} from "lucide-react";
import { ThemeToggle, useTheme } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const Header = () => (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-background/50 backdrop-blur-xl border-b border-white/5 animate-slide-in-from-top">
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
                <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Link href="/#features">Features</Link>
                </Button>
                <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Link href="/#how-it-works">How It Works</Link>
                </Button>
                 <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Link href="/about">About Us</Link>
                </Button>
                <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Link href="/posts">Blog</Link>
                </Button>
                <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Link href="/learn-git">Learn Git</Link>
                </Button>
                <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Link href="/#generator">Generator</Link>
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
                            <Link href="/#features" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
                            <Link href="/#how-it-works" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
                            <Link href="/about" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
                            <Link href="/posts" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
                            <Link href="/learn-git" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Learn Git</Link>
                            <Link href="/#generator" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Generator</Link>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
            <ThemeToggle />
        </div>
    </header>
);

const Hero = () => {
  const { theme } = useTheme();
  const headlines = [
    "Generate Stunning READMEs, Instantly.",
    "Document Your Code with Power.",
    "From Repository to Readme in Seconds.",
    "Effortless Documentation, Elevated.",
  ];

  const [headlineIndex, setHeadlineIndex] = React.useState(0);
  const [videoSrc, setVideoSrc] = React.useState("");

  React.useEffect(() => {
    const interval = setInterval(() => {
      setHeadlineIndex((prevIndex) => (prevIndex + 1) % headlines.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [headlines.length]);

  React.useEffect(() => {
    // Set video source only on client-side after mount to avoid hydration mismatch
    setVideoSrc(
      theme === "light"
        ? "https://videos.pexels.com/video-files/4974884/4974884-hd_1920_1080_25fps.mp4"
        : "https://videos.pexels.com/video-files/5495846/5495846-uhd_2560_1080_30fps.mp4"
    );
  }, [theme]);

  return (
    <section
      id="home"
      className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
    >
      {videoSrc && (
        <video
          key={videoSrc} // Use videoSrc as key to force re-render on change
          autoPlay
          loop
          muted
          playsInline
          className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover"
          src={videoSrc}
        >
          Your browser does not support the video tag.
        </video>
      )}
      <div className="absolute inset-0 bg-black/60 z-10"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center z-20">
        <div
          style={{ animationDelay: "0.2s" }}
          className="animate-slide-in-from-bottom h-36 md:h-48 flex items-center justify-center"
        >
          <h1
            key={headlineIndex}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white animate-fade-in-out"
            style={{ textShadow: "0 4px 30px rgba(0, 0, 0, 0.5)" }}
          >
            {headlines[headlineIndex]}
          </h1>
        </div>
        <div
          style={{ animationDelay: "0.4s" }}
          className="animate-slide-in-from-bottom"
        >
          <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-12 [text-wrap:balance]">
            Our system analyzes any public repository or local project to
            generate polished, professional, and comprehensive documentation in
            seconds.
          </p>
        </div>
        <div
          style={{ animationDelay: "0.6s" }}
          className="animate-slide-in-from-bottom flex justify-center"
        >
          <a href="#generator">
            <Button
              size="lg"
              className="h-12 sm:h-14 text-base sm:text-lg font-bold bg-primary text-primary-foreground rounded-full shadow-[0_0_20px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.6)] transition-all duration-300 transform hover:scale-105"
            >
              <Sparkles className="mr-3" /> Start Generating Now
            </Button>
          </a>
        </div>
      </div>
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce"
        style={{ animationDelay: "1s" }}
      >
        <a href="#features" aria-label="Scroll down">
          <ArrowDown className="h-6 w-6 text-gray-400 hover:text-primary transition-colors" />
        </a>
      </div>
    </section>
  );
};

const FeatureCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white/5 p-6 sm:p-8 rounded-2xl backdrop-blur-lg shadow-2xl group relative overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300">
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="relative z-10">
      <div className="mb-5 flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-secondary text-primary">
        {icon}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold mb-3 text-card-foreground">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">{children}</p>
    </div>
  </div>
);

const Features = () => (
  <section id="features" className="w-full py-24 sm:py-32 bg-background/80">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className="text-center mb-12 sm:mb-20 animate-slide-in-from-bottom"
        style={{ animationDelay: "0.2s", opacity: 0 }}
      >
        <h2 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-700 dark:from-white light:text-slate-900 dark:to-gray-400">
          A Powerful Documentation Partner
        </h2>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto [text-wrap:balance]">
          Our platform offers a suite of tools to streamline your documentation
          process.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        <div
          className="animate-slide-in-from-bottom"
          style={{ animationDelay: "0.4s", opacity: 0 }}
        >
          <FeatureCard
            icon={<BotMessageSquare size={32} />}
            title="Smart Content"
          >
            Our system analyzes code to generate descriptions, tech stacks, and
            setup guides automatically.
          </FeatureCard>
        </div>
        <div
          className="animate-slide-in-from-bottom"
          style={{ animationDelay: "0.6s", opacity: 0 }}
        >
          <FeatureCard
            icon={<BookOpen size={32} />}
            title="Comprehensive Analysis"
          >
            Detects dependencies, run commands, and project structure to create
            a complete and accurate README.
          </FeatureCard>
        </div>
        <div
          className="animate-slide-in-from-bottom"
          style={{ animationDelay: "0.8s", opacity: 0 }}
        >
          <FeatureCard
            icon={<Code size={32} />}
            title="Professional Formatting"
          >
            Generates clean, well-structured Markdown with badges, code blocks,
            and clear sections.
          </FeatureCard>
        </div>
      </div>
    </div>
  </section>
);

const StepItem = ({
  number,
  title,
  children,
  isLast,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
  isLast?: boolean;
}) => (
  <div
    className="relative pl-20 sm:pl-24 pb-12 animate-slide-in-from-bottom"
    style={{ opacity: 0 }}
  >
    {!isLast && (
      <div className="absolute left-[30px] sm:left-[30px] top-12 h-full w-px bg-border/30"></div>
    )}
    <div className="absolute left-0 top-2 flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 border-2 border-primary/50 text-white text-xl font-bold flex items-center justify-center shadow-[0_0_20px_hsl(var(--primary)/0.5)]">
      {number}
    </div>
    <div className="pt-2">
      <h3 className="text-xl sm:text-2xl font-bold mb-2 text-foreground">
        {title}
      </h3>
      <p className="text-muted-foreground text-base sm:text-lg">{children}</p>
    </div>
  </div>
);

const HowItWorks = () => (
  <section id="how-it-works" className="w-full py-24 sm:py-32 bg-secondary/20">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 sm:mb-20">
        <h2 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-700 dark:from-white light:text-slate-900 dark:to-gray-400">
          Simple Steps to a Perfect README
        </h2>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto [text-wrap:balance]">
          Follow our straightforward process to generate stunning documentation.
        </p>
      </div>
      <div className="max-w-3xl mx-auto">
        <StepItem number="1" title="Provide Repository URL">
          Enter the public URL of your GitHub repository. Our tool needs access
          to analyze the code.
        </StepItem>
        <StepItem number="2" title="Analysis Engine">
          Our system fetches your repository data to analyze its structure,
          dependencies, and code.
        </StepItem>
        <StepItem number="3" title="Generate & Review">
          The generated README.md is instantly displayed for you to review,
          copy, or download.
        </StepItem>
        <StepItem number="4" title="Deploy with Pride" isLast>
          Add the professional, comprehensive README to your project to impress
          and inform.
        </StepItem>
      </div>
    </div>
  </section>
);


const Generator = () => (
  <section
    id="generator"
    className="w-full py-24 sm:py-32 bg-background/80 relative overflow-hidden"
  >
    <div
      className="w-full px-4 sm:px-6 lg:px-8"
      style={{ width: "90%", margin: "0 auto" }}
    >
      <div className="bg-white/5 p-4 sm:p-8 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-lg">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-700 dark:from-white light:text-slate-900 dark:to-gray-400">
            Ready to Start?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-12 [text-wrap:balance]">
            Give your project the README it deserves. Paste your public GitHub
            repository URL below or select a local project folder from your system to
            get started.
          </p>
        </div>
        <ReadmeForm />
      </div>
    </div>
  </section>
);

const BlogSection = () => {
    const [latestPosts, setLatestPosts] = useState<Post[]>([]);
    
    React.useEffect(() => {
        const fetchPosts = async () => {
            const allPosts = await getPosts();
            setLatestPosts(allPosts.slice(0, 3));
        };
        fetchPosts();
    }, []);

    if (latestPosts.length === 0) {
        return null;
    }

    return (
        <section id="blog" className="w-full py-24 sm:py-32 bg-secondary/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 sm:mb-20">
                    <h2 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-700 dark:from-white light:text-slate-900 dark:to-gray-400">
                        From Our Blog
                    </h2>
                    <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto [text-wrap:balance]">
                        Explore the latest articles, tutorials, and news from our team.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {latestPosts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Button asChild size="lg">
                        <Link href="/posts">View All Posts</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

function PostCard({ post }: { post: Post }) {
    const publishedDate = new Date(post.publishedAt.seconds * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const summary = post.content.split(' ').slice(0, 20).join(' ') + '...';

    return (
        <Card className="flex flex-col overflow-hidden bg-white/5 border-white/10 hover:border-primary/50 transition-all duration-300 h-full">
             <Link href={`/posts/${post.slug}`} className="block">
                <Image
                    src={post.imageUrl || 'https://placehold.co/600x400.png'}
                    alt={post.title}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                    data-ai-hint="tech blog"
                />
            </Link>
            <CardHeader>
                <Link href={`/posts/${post.slug}`}>
                    <CardTitle className="text-2xl font-bold hover:text-primary transition-colors">{post.title}</CardTitle>
                </Link>
                 <CardDescription className="text-sm text-muted-foreground pt-2">
                    By {post.authorName} on {publishedDate}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-muted-foreground">{summary}</p>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
                 <Button asChild>
                    <Link href={`/posts/${post.slug}`}>Read More</Link>
                </Button>
            </div>
        </Card>
    );
}


const Footer = () => {
  const [year, setYear] = React.useState(new Date().getFullYear());

  React.useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full py-12 bg-secondary/20 border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-4">
              <Link href="/" className="flex items-center justify-center md:justify-start gap-3 cursor-pointer">
                  <Image
                      src="https://drive.google.com/uc?export=view&id=1Xml9oa7fXxInG122MonM9niKrPtsSTzf"
                      alt="ReadmeBuddy Logo"
                      width={32}
                      height={32}
                      className="h-8 w-8"
                  />
                  <span className="text-xl font-bold">ReadmeBuddy</span>
              </Link>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto md:mx-0">
                  The fastest way to generate professional README files for your projects. Save time, impress visitors.
              </p>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                  <h4 className="font-semibold mb-4 text-foreground">Navigate</h4>
                  <ul className="space-y-2">
                      <li><Link href="/#features" className="text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
                      <li><Link href="/posts" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
                      <li><Link href="/learn-git" className="text-muted-foreground hover:text-primary transition-colors">Learn Git</Link></li>
                      <li><Link href="/#generator" className="text-muted-foreground hover:text-primary transition-colors">Generator</Link></li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-semibold mb-4 text-foreground">Company</h4>
                  <ul className="space-y-2">
                      <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                      <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                      <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
                  </ul>
              </div>
               <div>
                  <h4 className="font-semibold mb-4 text-foreground">Connect</h4>
                  <ul className="space-y-2">
                      <li><a href="https://github.com/coder-shubh" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">GitHub</a></li>
                      {/* <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Twitter</a></li> */}
                  </ul>
              </div>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {year} ReadmeBuddy. All Rights Reserved.</p>
           <p className="mt-2">
            Built with ❤️ by developers, for developers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Generator />
        <BlogSection />
      </main>
      <Footer />
    </>
  );
}
