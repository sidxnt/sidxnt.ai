
export enum Sender {
  User = 'user',
  AI = 'ai',
}

export interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
}

export enum View {
    Chat = 'chat',
    Image = 'image',
}
