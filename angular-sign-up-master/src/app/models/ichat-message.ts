import { Timestamp } from '@angular/fire/firestore';

export interface IChatMessage {
    id?: string;
    senderId: string;
    receiverId: string;
    message: string;
    timestamp: Timestamp;
    senderName: string;
    receiverName: string;
} 