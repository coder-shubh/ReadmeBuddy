import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";
import { Inter } from "next/font/google";
import Analytics from "@/components/analytics";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const siteConfig = {
  name: "ReadmeBuddy",
  url: "https://readmebuddy.com", // Replaced with your actual domain
  ogImage:
    "https://drive.google.com/uc?export=view&id=1Xml9oa7fXxInG122MonM9niKrPtsSTzf",
  description:
    "Quickly generate clean and professional README.md files for your GitHub repositories. Save time on project documentation with a streamlined developer tool.",
  links: {
    twitter: "https://twitter.com/your-twitter-handle", // Replace if you have one
    github: "https://github.com/coder-shubh", // Replace with your repo
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | GitHub README Generator for Developers`,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: siteConfig.url,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      maxImagePreview: "large",
    },
  },
  keywords: [
    "README generator",
    "ReadmeBuddy",
    "readmebuddy",
    "Readmebuddy",
    "coder-shubh",
    "codershubh",
    "GitHub README",
    "AI documentation",
    "Markdown generator",
    "Developer tools",
    "Open source documentation",
    "Project documentation",
    "Next.js",
    "React",
    "Genkit",
    "GitHub README generator",
    "README.md AI generator",
    "Generate README for GitHub",
    "GitHub repository documentation",
    "README for Git project",
    "git readme generator",
    "GitHub markdown generator",
    "AI GitHub tools",
    "GitHub automation",
    "developer documentation tools",
    "GitHub code documentation",
    "open source readme generator",
    "readme template Git",
    "github",
    "git",
    "blog",
    "google",
    "documentation tool"
  ],
  authors: [
    {
      name: "ReadmeBuddy Team",
      url: siteConfig.url,
    },
  ],
  creator: "ReadmeBuddy",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: `${siteConfig.name} | GitHub README Generator`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | GitHub README Tool`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@your-twitter-handle", // Replace if you have one
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} !scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="font-body antialiased bg-background">
        <Suspense fallback={null}>
            <Analytics />
        </Suspense>
        <Script
          id="adsbygoogle-init"
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9542271423351303"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
