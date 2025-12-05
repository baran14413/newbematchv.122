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

export const profiles: UserProfile[] = [
  {
    id: '1',
    name: 'Selin',
    age: 28,
    bio: 'Sanat yönetmeni. Sürrealist tablolara ve yağmurlu günlere bayılırım. Muhtemelen şu an makarnayı düşünüyorum. 🍝',
    avatarUrl: placeholderImages.find(p => p.id === 'user-1-avatar')?.imageUrl ?? '',
    imageUrls: [
      placeholderImages.find(p => p.id === 'user-1-p1')?.imageUrl ?? '',
      placeholderImages.find(p => p.id === 'user-1-p2')?.imageUrl ?? '',
    ],
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    voiceNoteUrl: '/placeholder-audio.mp3',
    prompts: [
      { question: 'Kalbimin anahtarı...', answer: 'Mükemmel hazırlanmış bir Spotify çalma listesidir.' },
      { question: 'Şu konuda çok hırslanırım...', answer: 'Mario Kart. Bana bulaşma bile.' },
    ],
    zodiac: 'Koç',
  },
  {
    id: '2',
    name: 'Alex',
    age: 31,
    bio: 'Gündüzleri yazılım mühendisi, geceleri hevesli bir şef. Hayat boyu sous şefim olacak birini arıyorum.',
    avatarUrl: placeholderImages.find(p => p.id === 'user-2-avatar')?.imageUrl ?? '',
    imageUrls: [
        placeholderImages.find(p => p.id === 'user-2-p1')?.imageUrl ?? '',
        placeholderImages.find(p => p.id === 'user-2-p2')?.imageUrl ?? '',
    ],
    prompts: [
      { question: 'Hayattaki bir hedefim...', answer: 'Her kıtayı ziyaret etmek.' },
      { question: 'Aradığım kişi...', answer: 'Kendini çok ciddiye almayan biri.' },
    ],
    zodiac: 'Terazi',
  },
    {
    id: '3',
    name: 'Chloe',
    age: 26,
    bio: 'Plaj tutkunu, köpek annesi ve profesyonel gün batımı izleyicisi. Şehirdeki en iyi tacoları bulalım.',
    avatarUrl: placeholderImages.find(p => p.id === 'user-3-avatar')?.imageUrl ?? '',
    imageUrls: [
        placeholderImages.find(p => p.id === 'user-3-p1')?.imageUrl ?? '',
    ],
    prompts: [
      { question: 'Yorum bırakmalısın eğer...', answer: 'İyi bir yürüyüş rotası biliyorsan.' },
    ],
    zodiac: 'Balık',
  },
];

export const conversations: Conversation[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Selin',
    avatarUrl: placeholderImages.find(p => p.id === 'user-1-avatar')?.imageUrl ?? '',
    lastMessage: 'Haha, bu cesur bir iddia! Meydan okumanı kabul ediyorum!',
    timestamp: '10m ago',
    unreadCount: 1,
    messages: [
      { id: 1, text: 'Şu konuda çok hırslanırım: Mario Kart. Bana bulaşma bile.', sender: 'them', timestamp: '10:40 PM', type: 'text' },
      { id: 2, text: 'Bu bir meydan okuma mı? Ben bir Rainbow Road ustasıyımdır da.', sender: 'me', timestamp: '10:41 PM', type: 'text' },
      { id: 3, text: 'Geçen haftasonu çektiğim bir fotoğraf :)', sender: 'them', timestamp: '10:42 PM', type: 'image', imageUrl: placeholderImages.find(p => p.id === 'user-1-p2')?.imageUrl ?? '' },
      { id: 4, text: 'Haha, bu cesur bir iddia! Meydan okumanı kabul ediyorum!', sender: 'them', timestamp: '10:43 PM', type: 'text' },
      { id: 5, text: 'Bunu bir sesli notla duymak istiyorum!', sender: 'me', timestamp: '10:44 PM', type: 'text' },
      { id: 6, text: 'Al bakalım ;)', sender: 'them', timestamp: '10:45 PM', type: 'voice', audioUrl: '/placeholder-audio.mp3' },
    ],
  },
  {
    id: '2',
    userId: '2',
    userName: 'Alex',
    avatarUrl: placeholderImages.find(p => p.id === 'user-2-avatar')?.imageUrl ?? '',
    lastMessage: 'Sous şef lafıyla beni tavladın.',
    timestamp: '1h ago',
    unreadCount: 0,
    messages: [
      { id: 1, text: 'Sous şef lafıyla beni tavladın.', sender: 'me', timestamp: '9:30 PM', type: 'text' },
    ],
  },
];

export const newMatches: Pick<UserProfile, 'id' | 'name' | 'avatarUrl'>[] = [
    { id: '3', name: 'Chloe', avatarUrl: placeholderImages.find(p => p.id === 'user-3-avatar')?.imageUrl ?? '' },
    { id: '4', name: 'Ben', avatarUrl: placeholderImages.find(p => p.id === 'user-4-avatar')?.imageUrl ?? '' },
    { id: '5', name: 'Maya', avatarUrl: placeholderImages.find(p => p.id === 'user-5-avatar')?.imageUrl ?? '' },
    { id: '6', name: 'Leo', avatarUrl: placeholderImages.find(p => p.id === 'user-6-avatar')?.imageUrl ?? '' },
]

export const zodiacSigns = [
  "Koç", "Boğa", "İkizler", "Yengeç", "Aslan", "Başak",
  "Terazi", "Akrep", "Yay", "Oğlak", "Kova", "Balık"
];
