'use client';
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
  updatedAt?: any;
  isEdited?: boolean;
  type?: 'text' | 'image' | 'voice';
  imageUrl?: string;
  audioUrl?: string;
  isAiGenerated: boolean;
  reactions?: { [emoji: string]: string[] }; // Map of emoji to user IDs
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
  lastSeen?: any;
  // User Preferences
  interestedIn?: 'man' | 'woman' | 'everyone';
  globalMode?: boolean;
  maxDistance?: number;
  ageRange?: [number, number];
}

export type Conversation = {
  id: string; // This is the Match ID
  otherUser: UserProfile;
  messages: Message[];
};
