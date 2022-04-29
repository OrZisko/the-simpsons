export interface Comment {
  id: number;
  parentCommentId: number | null;
  children: number[];
  ownerId: number;
  ownerName: string;
  txt: string;
  createdAt: number;
  deletedAt: number | null;
}
