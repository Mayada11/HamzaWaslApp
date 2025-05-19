import { Timestamp } from "@angular/fire/firestore";

export interface Post{
  postId: string,
  teacherId: string,
  societyId: string,
  content: string,
  creator: string,
  createdAt: Timestamp,
  mediaUrl?: string
  comments: Comment[],
  likes: Like[]
}

export interface Comment {
  creator: string,
  studentId: string,
  content: string,
  createdAt: Timestamp
}

export interface Like {
  creator: string,
  studentId: string,
  createdAt: Timestamp
}
