
import Link from 'next/link';
import Image from "next/image";
import { getPosts } from "@/lib/posts";
import type { Post } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

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
            <Button asChild variant="ghost">
                <Link href="/">Back to Home</Link>
            </Button>
            <Button asChild variant="ghost">
                <Link href="/learn-git">Learn Git</Link>
            </Button>
            <ThemeToggle />
        </div>
    </header>
);

function PostCard({ post }: { post: Post }) {
    const publishedDate = new Date(post.publishedAt.seconds * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const summary = post.content.split(' ').slice(0, 30).join(' ') + '...';

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

export default async function PostsPage() {
    const posts = await getPosts();

    return (
        <>
            <LegalHeader />
            <main className="container mx-auto px-4 py-12 md:py-20">
                <div className="text-center mb-12 sm:mb-20">
                    <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-700 dark:from-white light:text-slate-900 dark:to-gray-400">
                        Our Blog
                    </h1>
                    <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto [text-wrap:balance]">
                        News, updates, and insights from the ReadmeBuddy team. Explore articles on developer productivity, documentation best practices, and new features.
                    </p>
                </div>
                
                {posts.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground bg-secondary/30 border border-border/50 rounded-xl p-8 max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Coming Soon!</h2>
                        <p className="mb-6">We're busy writing our first batch of articles. Check back soon for tutorials, tips, and insights on developer tools and documentation best practices.</p>
                         <Button asChild>
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </div>
                )}
            </main>
        </>
    );
}
