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
  videoDescription?: string;
  voiceNoteUrl?: string;
  prompts: Prompt[];
  zodiac: string;
  location: string;
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
    id: 'user-1',
    name: 'Sarah',
    age: 28,
    bio: 'Sanat galerilerini gezmeyi ve yeni kahve dükkanları keşfetmeyi seviyorum. Hafta sonları ya bir sergide ya da elimde bir kitapla parkta bulabilirsiniz beni. 🎨☕️',
    avatarUrl: placeholderImages.find(p => p.id === 'user-1-avatar')?.imageUrl ?? '',
    imageUrls: [
      placeholderImages.find(p => p.id === 'user-1-avatar')?.imageUrl ?? '',
      placeholderImages.find(p => p.id === 'user-1-p1')?.imageUrl ?? '',
      placeholderImages.find(p => p.id === 'user-1-p2')?.imageUrl ?? ''
    ],
    videoUrl: 'https://storage.googleapis.com/static.a-studio.co/boom/s1.mp4',
    videoDescription: 'Floransa\'da bir sanat atölyesinde geçen hafta yaptığım tablo. 🇮🇹',
    voiceNoteUrl: 'https://storage.googleapis.com/static.a-studio.co/boom/v1.mp3',
    prompts: [
      { question: 'İki gerçek bir yalan...', answer: 'Everest\'e tırmandım, 5 dil biliyorum, profesyonel olarak salsa dansı yaptım. Bil bakalım hangisi yalan?' },
      { question: 'Asla hayır demeyeceğim şey', answer: 'Gece yarısı dondurma kaçamağı.' }
    ],
    zodiac: 'Yengeç',
    location: 'Kadıköy, İstanbul',
  },
  {
    id: 'user-2',
    name: 'Alex',
    age: 31,
    bio: 'Yazılım mühendisi ve amatör müzisyen. Kod yazmadığım zamanlarda bas gitarımla uğraşıyorum veya arkadaşlarımla sahilde voleybol oynuyorum. 💻🎸🏐',
    avatarUrl: placeholderImages.find(p => p.id === 'user-2-avatar')?.imageUrl ?? '',
    imageUrls: [
      placeholderImages.find(p => p.id === 'user-2-avatar')?.imageUrl ?? '',
      placeholderImages.find(p => p.id === 'user-2-p1')?.imageUrl ?? '',
      placeholderImages.find(p => p.id === 'user-2-p2')?.imageUrl ?? ''
    ],
    videoUrl: 'https://storage.googleapis.com/static.a-studio.co/boom/s2.mp4',
    videoDescription: 'Grubumuzla geçen haftaki provadan küçük bir kesit. 🤘',
    voiceNoteUrl: 'https://storage.googleapis.com/static.a-studio.co/boom/v2.mp3',
    prompts: [
      { question: 'Tipik bir Pazar günüm', answer: 'Uzun bir kahvaltı, ardından yeni bir şeyler öğrenmek için online bir kurs ve akşam da film maratonu.' },
      { question: 'Birlikte yapabileceğimiz en iyi şey', answer: 'Canlı bir konsere gidip gecenin sonuna kadar dans etmek.' }
    ],
    zodiac: 'Kova',
    location: 'Beşiktaş, İstanbul',
  },
  {
    id: 'user-3',
    name: 'Chloe',
    age: 25,
    bio: 'Doğa aşığı ve yoga tutkunu. Şehrin gürültüsünden kaçıp kamp yapmaya bayılırım. Bir sonraki maceramı planlarken bana katılmak ister misin? 🏕️🧘‍♀️',
    avatarUrl: placeholderImages.find(p => p.id === 'user-3-avatar')?.imageUrl ?? '',
    imageUrls: [
       placeholderImages.find(p => p.id === 'user-3-avatar')?.imageUrl ?? '',
       placeholderImages.find(p => p.id === 'user-3-p1')?.imageUrl ?? '',
    ],
    videoUrl: 'https://storage.googleapis.com/static.a-studio.co/boom/s3.mp4',
    videoDescription: 'Rishikesh\'teki yoga kampından günaydın! ☀️',
    voiceNoteUrl: 'https://storage.googleapis.com/static.a-studio.co/boom/v3.mp3',
    prompts: [
      { question: 'Beni en çok güldüren şey', answer: 'İyi zamanlanmış bir "absürt" şaka.' },
      { question: 'Hayatımın film müziği', answer: 'Bon Iver - Holocene' }
    ],
    zodiac: 'Balık',
    location: 'Cihangir, İstanbul',
  },
  {
    id: 'user-4',
    name: 'Ben',
    age: 34,
    bio: 'Gurme ve gezgin. Yeni tatlar denemek için dünyayı dolaşıyorum. Bir sonraki durağım için önerilere açığım! 🍜✈️',
    avatarUrl: placeholderImages.find(p => p.id === 'user-4-avatar')?.imageUrl ?? '',
    imageUrls: [
       placeholderImages.find(p => p.id === 'user-4-avatar')?.imageUrl ?? '',
       placeholderImages.find(p => p.id === 'user-4-p1')?.imageUrl ?? '',
    ],
    videoUrl: 'https://storage.googleapis.com/static.a-studio.co/boom/s4.mp4',
    videoDescription: 'Tokyo\'daki ramen dükkanında hayatımın en iyi ramenini yerken!',
    voiceNoteUrl: 'https://storage.googleapis.com/static.a-studio.co/boom/v1.mp3',
    prompts: [
        { question: 'Misafirlerime yapacağım özel yemeğim', answer: 'Ağır ateşte pişmiş dana kaburga.' },
        { question: 'Beni etkilemenin yolu', answer: 'Bana daha önce hiç duymadığım bir şey öğret.' }
    ],
    zodiac: 'Boğa',
    location: 'Nişantaşı, İstanbul',
  },
];


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
