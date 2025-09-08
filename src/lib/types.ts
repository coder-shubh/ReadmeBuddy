import type { Timestamp } from "firebase/firestore";

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string;
  authorName: string;
  publishedAt: Timestamp;
}
