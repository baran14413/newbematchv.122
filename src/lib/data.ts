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
  id: string;
  senderId: string;
  text: string; 
  timestamp: any; // Can be Date or Firestore Timestamp
  type?: 'text' | 'image' | 'voice';
  imageUrl?: string;
  audioUrl?: string;
  isAiGenerated: boolean;
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
  latitude?: number;
  longitude?: number;
  goal?: string;
  interests?: string[];
  distance?: number;
  // User Preferences
  interestedIn?: 'man' | 'woman' | 'everyone';
  globalMode?: boolean;
  maxDistance?: number;
  ageRange?: [number, number];
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
    
    