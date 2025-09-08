"use server"

import { z } from "zod"
import { getRepoDetails, parseGitHubUrl } from "@/lib/github"

const ActionSchema = z.object({
  inputPath: z.string().min(1),
})

export async function getRepoInfoAction(data: z.infer<typeof ActionSchema>) {
  try {
    const validatedData = ActionSchema.parse(data)
    const { inputPath } = validatedData
    
    const parsedUrl = parseGitHubUrl(inputPath);
    if (!parsedUrl) {
      return { success: false, error: "Invalid GitHub URL format. Please provide a public GitHub repository URL (e.g., https://github.com/user/repo)." }
    }

    const repoInfo = await getRepoDetails(inputPath);
    if (!repoInfo) {
      return { success: false, error: "Could not fetch repository details. Make sure the URL is correct and the repository is public." }
    }

    return { success: true, repoInfo }
  } catch (error) {
    console.error("Error in getRepoInfoAction:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred."
    return { success: false, error: message }
  }
}
