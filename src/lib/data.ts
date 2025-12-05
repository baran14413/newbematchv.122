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
  id: number; 
  text: string; 
  sender: 'me' | 'them'; 
  timestamp: string;
  type?: 'text' | 'image' | 'voice';
  imageUrl?: string;
  audioUrl?: string;
};

export interface UserProfile {
  id: string; // Changed to string for Firestore
  name: string;
  age: number;
  bio: string;
  avatarUrl: string;
  imageUrls: string[];
  videoUrl?: string;
  voiceNoteUrl?: string;
  prompts: Prompt[];
  zodiac: string;
  location: string;
  // personalityTraits are removed for simplification with firestore integration
}

export type Conversation = {
  id: string;
  userId: string; // Changed to string for Firestore
  userName: string;
  avatarUrl: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: Message[];
};

export const currentUser = {
  id: 0,
  name: "You",
  personalityTraits: [
    { trait: 'Maceracı', userScore: 80, viewerScore: 60 },
    { trait: 'Yaratıcı', userScore: 90, viewerScore: 75 },
    { trait: 'İçedönük', userScore: 40, viewerScore: 50 },
    { trait: 'Spontan', userScore: 70, viewerScore: 85 },
    { trait: 'Mizahi', userScore: 85, viewerScore: 90 },
  ]
};

export const profiles: UserProfile[] = [];

export const conversations: Conversation[] = [];

export const newMatches: Pick<UserProfile, 'id' | 'name' | 'avatarUrl'>[] = []

export const zodiacSigns = [
  "Koç", "Boğa", "İkizler", "Yengeç", "Aslan", "Başak",
  "Terazi", "Akrep", "Yay", "Oğlak", "Kova", "Balık"
];

export const likesYouData: { id: string; name: string; avatarUrl: string; likeType: 'like' | 'superlike' | 'locked' }[] = [
    { id: '1', name: 'Sarah', avatarUrl: placeholderImages.find(p => p.id === 'user-1-avatar')?.imageUrl ?? '', likeType: 'superlike'},
    { id: '2', name: 'Chloe', avatarUrl: placeholderImages.find(p => p.id === 'user-3-avatar')?.imageUrl ?? '', likeType: 'like'},
    { id: '3', name: 'Locked', avatarUrl: '', likeType: 'locked'},
    { id: '4', name: 'Locked', avatarUrl: '', likeType: 'locked'},
    { id: '5', name: 'Locked', avatarUrl: '', likeType: 'locked'},
]
