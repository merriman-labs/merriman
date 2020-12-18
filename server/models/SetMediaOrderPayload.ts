export interface SetMediaOrderPayload {
  libraryId: string;
  mediaId: string;
  direction: 'up' | 'down';
}
