import Link from 'next/link';
import Image from "next/image";
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/posts';
import { marked } from 'marked';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Calendar, User } from 'lucide-react';

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
                <Link href="/posts">Back to Blog</Link>
            </Button>
            <Button asChild variant="ghost">
                <Link href="/learn-git">Learn Git</Link>
            </Button>
            <ThemeToggle />
        </div>
    </header>
);

export default async function PostPage({ params }: { params: { slug: string } }) {
    const post = await getPostBySlug(params.slug);

    if (!post) {
        notFound();
    }

    const htmlContent = await marked.parse(post.content);
    const publishedDate = new Date(post.publishedAt.seconds * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <>
            <LegalHeader />
            <main className="container mx-auto px-4 py-12 md:py-20">
                <article className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">{post.title}</h1>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground mb-8">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{post.authorName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <time dateTime={new Date(post.publishedAt.seconds * 1000).toISOString()}>
                                {publishedDate}
                            </time>
                        </div>
                    </div>
                    
                    <Image
                        src={post.imageUrl || 'https://placehold.co/1200x600.png'}
                        alt={post.title}
                        width={1200}
                        height={600}
                        className="w-full h-auto object-cover rounded-lg mb-8 shadow-lg"
                        priority
                        data-ai-hint="tech header"
                    />

                    <div 
                        className="prose dark:prose-invert prose-lg max-w-none markdown-content"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                </article>
            </main>
        </>
    );
}

// Optional: Generate static paths for better performance
import { getPosts } from '@/lib/posts';

export async function generateStaticParams() {
    const posts = await getPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}
