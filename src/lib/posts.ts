import { collection, getDocs, query, where, limit, getDoc, doc, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import type { Post } from "./types";

// Function to fetch all posts
export async function getPosts(): Promise<Post[]> {
  if (!db) return [];
  try {
    const postsCollection = collection(db, "posts");
    const q = query(postsCollection, orderBy("publishedAt", "desc"));
    const postsSnapshot = await getDocs(q);
    const postsList = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Post));
    return postsList;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

// Function to fetch a single post by its slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!db) return null;
  try {
    const postsCollection = collection(db, "posts");
    const q = query(postsCollection, where("slug", "==", slug), limit(1));
    const postSnapshot = await getDocs(q);

    if (postSnapshot.empty) {
      console.log(`No post found with slug: ${slug}`);
      return null;
    }

    const postDoc = postSnapshot.docs[0];
    return {
      id: postDoc.id,
      ...postDoc.data()
    } as Post;
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return null;
  }
}
