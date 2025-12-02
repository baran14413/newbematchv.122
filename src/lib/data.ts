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

export type UserProfile = {
  id: number;
  name: string;
  age: number;
  bio: string;
  avatarUrl: string;
  imageUrls: string[];
  videoUrl?: string;
  voiceNoteUrl?: string;
  prompts: Prompt[];
  personalityTraits: PersonalityTrait[];
  zodiac: string;
};

export type Conversation = {
  id: number;
  userId: number;
  userName: string;
  avatarUrl: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: { id: number; text: string; sender: 'me' | 'them'; timestamp: string }[];
};

export const currentUser = {
  id: 0,
  name: "You",
  personalityTraits: [
    { trait: 'Adventurous', userScore: 80, viewerScore: 60 },
    { trait: 'Creative', userScore: 90, viewerScore: 75 },
    { trait: 'Introverted', userScore: 40, viewerScore: 50 },
    { trait: 'Spontaneous', userScore: 70, viewerScore: 85 },
    { trait: 'Humorous', userScore: 85, viewerScore: 90 },
  ]
};

export const profiles: UserProfile[] = [
  {
    id: 1,
    name: 'Sarah',
    age: 28,
    bio: 'Art director with a love for surrealist paintings and rainy days. Probably thinking about pasta. 🍝',
    avatarUrl: placeholderImages.find(p => p.id === 'user-1-avatar')?.imageUrl ?? '',
    imageUrls: [
      placeholderImages.find(p => p.id === 'user-1-p1')?.imageUrl ?? '',
      placeholderImages.find(p => p.id === 'user-1-p2')?.imageUrl ?? '',
    ],
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    voiceNoteUrl: '/placeholder-audio.mp3',
    prompts: [
      { question: 'The key to my heart is...', answer: 'A perfectly curated Spotify playlist.' },
      { question: 'I get way too competitive about...', answer: 'Mario Kart. Don\'t even try me.' },
    ],
    personalityTraits: [
        { trait: 'Adventurous', userScore: 60, viewerScore: 80 },
        { trait: 'Creative', userScore: 75, viewerScore: 90 },
        { trait: 'Introverted', userScore: 50, viewerScore: 40 },
        { trait: 'Spontaneous', userScore: 85, viewerScore: 70 },
        { trait: 'Humorous', userScore: 90, viewerScore: 85 },
    ],
    zodiac: 'Aries',
  },
  {
    id: 2,
    name: 'Alex',
    age: 31,
    bio: 'Software engineer by day, aspiring chef by night. Looking for someone to be my sous chef for life.',
    avatarUrl: placeholderImages.find(p => p.id === 'user-2-avatar')?.imageUrl ?? '',
    imageUrls: [
        placeholderImages.find(p => p.id === 'user-2-p1')?.imageUrl ?? '',
        placeholderImages.find(p => p.id === 'user-2-p2')?.imageUrl ?? '',
    ],
    prompts: [
      { question: 'A life goal of mine is...', answer: 'To visit every continent.' },
      { question: 'I\'m looking for...', answer: 'Someone who doesn\'t take themselves too seriously.' },
    ],
    personalityTraits: [
        { trait: 'Adventurous', userScore: 90, viewerScore: 80 },
        { trait: 'Creative', userScore: 50, viewerScore: 90 },
        { trait: 'Introverted', userScore: 30, viewerScore: 40 },
        { trait: 'Spontaneous', userScore: 60, viewerScore: 70 },
        { trait: 'Humorous', userScore: 75, viewerScore: 85 },
    ],
    zodiac: 'Libra',
  },
    {
    id: 3,
    name: 'Chloe',
    age: 26,
    bio: 'Beach bum, dog mom, and professional sunset watcher. Let\'s find the best tacos in town.',
    avatarUrl: placeholderImages.find(p => p.id === 'user-3-avatar')?.imageUrl ?? '',
    imageUrls: [
        placeholderImages.find(p => p.id === 'user-3-p1')?.imageUrl ?? '',
    ],
    prompts: [
      { question: 'You should leave a comment if...', answer: 'You know a good hiking spot.' },
    ],
    personalityTraits: [],
    zodiac: 'Pisces',
  },
];

export const conversations: Conversation[] = [
  {
    id: 1,
    userId: 1,
    userName: 'Sarah',
    avatarUrl: placeholderImages.find(p => p.id === 'user-1-avatar')?.imageUrl ?? '',
    lastMessage: 'Haha, that\'s a bold claim! You\'re on!',
    timestamp: '10m ago',
    unreadCount: 1,
    messages: [
      { id: 1, text: 'I get way too competitive about Mario Kart. Don\'t even try me.', sender: 'them', timestamp: '1h ago' },
      { id: 2, text: 'Is that a challenge? I happen to be a Rainbow Road master.', sender: 'me', timestamp: '30m ago' },
      { id: 3, text: 'Haha, that\'s a bold claim! You\'re on!', sender: 'them', timestamp: '10m ago' },
    ],
  },
  {
    id: 2,
    userId: 2,
    userName: 'Alex',
    avatarUrl: placeholderImages.find(p => p.id === 'user-2-avatar')?.imageUrl ?? '',
    lastMessage: 'You had me at sous chef.',
    timestamp: '1h ago',
    unreadCount: 0,
    messages: [
      { id: 1, text: 'You had me at sous chef.', sender: 'me', timestamp: '1h ago' },
    ],
  },
];

export const newMatches: Pick<UserProfile, 'id' | 'name' | 'avatarUrl'>[] = [
    { id: 3, name: 'Chloe', avatarUrl: placeholderImages.find(p => p.id === 'user-3-avatar')?.imageUrl ?? '' },
    { id: 4, name: 'Ben', avatarUrl: placeholderImages.find(p => p.id === 'user-4-avatar')?.imageUrl ?? '' },
    { id: 5, name: 'Maya', avatarUrl: placeholderImages.find(p => p.id === 'user-5-avatar')?.imageUrl ?? '' },
    { id: 6, name: 'Leo', avatarUrl: placeholderImages.find(p => p.id === 'user-6-avatar')?.imageUrl ?? '' },
]

export const zodiacSigns = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];
