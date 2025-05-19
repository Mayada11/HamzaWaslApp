import { Timestamp } from "firebase/firestore";

export interface Enrollment {
  userId: string;
  socialId: string;
  joinedAt: Timestamp;
}
