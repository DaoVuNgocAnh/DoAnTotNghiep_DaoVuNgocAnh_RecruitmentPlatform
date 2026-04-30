export interface Notification {
  id: string;
  receiverId: string;
  senderId?: string;
  type?: string;
  title?: string;
  content?: string;
  targetType?: string;
  targetId?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  sender?: {
    id: string;
    fullName: string;
    avatarUrl?: string;
  };
}
