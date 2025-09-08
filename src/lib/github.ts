const GITHUB_API_BASE = "https://api.github.com";

interface RepoDetails {
    owner: string;
    repo: string;
    description: string;
    defaultBranch: string;
}

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname !== 'github.com') return null;
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        if (pathParts.length < 2) return null;
        const [owner, repo] = pathParts;
        return { owner, repo: repo.replace('.git', '') };
    } catch (error) {
        console.error("Invalid URL:", error);
        return null;
    }
}

export async function getRepoDetails(url: string): Promise<RepoDetails | null> {
    const parsed = parseGitHubUrl(url);
    if (!parsed) throw new Error("Invalid GitHub URL format.");

    const { owner, repo } = parsed;
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`);

    if (!response.ok) {
        if (response.status === 404) throw new Error("Repository not found. Please check the URL and ensure it's a public repository.");
        throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
        owner,
        repo,
        description: data.description || "",
        defaultBranch: data.default_branch,
    };
}

export async function getRepoFileTree(owner: string, repo: string, branch: string): Promise<any[] | null> {
    const branchResponse = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/branches/${branch}`);
    if (!branchResponse.ok) return null;
    const branchData = await branchResponse.json();
    const commitSha = branchData.commit.sha;

    const treeResponse = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/${commitSha}?recursive=1`);
    if (!treeResponse.ok) return null;
    const treeData = await treeResponse.json();
    
    return treeData.tree.filter((node: any) => node.type === 'blob');
}

export async function getFileContent(owner: string, repo: string, path: string): Promise<string | null> {
    // Disable caching to prevent server errors during multiple file fetches.
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`, { cache: 'no-store' });
    if (!response.ok) return null;
    const data = await response.json();

    if (data.encoding === 'base64' && data.content) {
        return Buffer.from(data.content, 'base64').toString('utf-8');
    }
    return data.content || null;
}
