import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

export const placeholderImages: ImagePlaceholder[] = PlaceHolderImages;

export type PersonalityTrait = {
  trait: string;
  userScore: number;
  viewerScore: number;
};

export type Prompt = {
  question: string;
  answer: string;
};

export type Message = { 
  id: string; // Changed to string
  text: string; 
  sender: 'me' | 'them' | string; // Allow for user ID 
  timestamp: string; // Or Date
  type?: 'text' | 'image' | 'voice';
  imageUrl?: string;
  audioUrl?: string;
};

export interface UserProfile {
  id: string; 
  name: string;
  firstName: string;
  lastName: string;
  age: number;
  bio: string;
  avatarUrl: string;
  imageUrls: string[];
  videoUrl?: string;
  videoDescription?: string;
  voiceNoteUrl?: string;
  prompts: Prompt[];
  zodiac: string;
  location: string;
  goal?: string;
  interests?: string[];
}

export type Conversation = {
  id: string;
  userId: string; 
  userName: string;
  avatarUrl: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: Message[];
};

export const zodiacSigns = [
  "Koç", "Boğa", "İkizler", "Yengeç", "Aslan", "Başak",
  "Terazi", "Akrep", "Yay", "Oğlak", "Kova", "Balık"
];
