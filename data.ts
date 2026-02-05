import { User, ProfileType, VerificationRequest, Event, InvitationCode, ChatMessage, Post, Ticket } from './types';

export const USERS: User[] = [
  {
    id: 'u1',
    nickname: 'Luna_BCN',
    profileType: ProfileType.SINGLE,
    publicPhoto: 'https://picsum.photos/id/64/400/400',
    gallery: ['https://picsum.photos/id/65/400/600', 'https://picsum.photos/id/66/400/600'],
    description: 'Explorando mi sensualidad en un entorno seguro. Amante del arte y los viajes.',
    location: 'Bogotá',
    interests: ['Fiestas Temáticas', 'Viajes', 'Cenas Íntimas'],
    trustScore: 85,
    verificationLevel: 'Verificado',
    isPremium: true,
    status: 'Active',
    joinedDate: '2024-01-10',
    email: 'elena.g@gmail.com',
    privateIdentity: [
        {
            fullName: 'Elena Gomez',
            dateOfBirth: '1996-05-15', // 28 years old
            idNumber: '1.020.304.500',
            idPhotoUrl: 'https://picsum.photos/id/338/400/400'
        }
    ],
    myInviteCodes: [
        { code: 'LUNA-01', type: ProfileType.SINGLE, generatedBy: 'u1', expiresAt: '2025-01-01', isUsed: false },
        { code: 'LUNA-02', type: ProfileType.SINGLE, generatedBy: 'u1', expiresAt: '2025-01-01', isUsed: true, usedBy: 'MarcoYSofia' },
        { code: 'LUNA-03', type: ProfileType.SINGLE, generatedBy: 'u1', expiresAt: '2025-01-01', isUsed: false },
        { code: 'LUNA-04', type: ProfileType.SINGLE, generatedBy: 'u1', expiresAt: '2025-01-01', isUsed: false },
        { code: 'LUNA-05', type: ProfileType.SINGLE, generatedBy: 'u1', expiresAt: '2025-01-01', isUsed: false },
    ]
  },
  {
    id: 'u2',
    nickname: 'MarcoYSofia',
    profileType: ProfileType.COUPLE,
    publicPhoto: 'https://picsum.photos/id/331/400/400',
    gallery: ['https://picsum.photos/id/334/400/600', 'https://picsum.photos/id/338/400/600'],
    description: 'Pareja cómplice buscando nuevas conexiones y experiencias swinger de calidad.',
    location: 'Medellín',
    interests: ['Intercambio', 'Clubs', 'Wellness'],
    trustScore: 92,
    verificationLevel: 'Alta Confianza',
    isPremium: true,
    status: 'Active',
    joinedDate: '2023-11-15',
    email: 'm_s_couple@hotmail.com',
    privateIdentity: [
        {
            fullName: 'Marco Ruiz',
            dateOfBirth: '1992-03-10', // 32
            idNumber: '98.765.432',
            idPhotoUrl: 'https://picsum.photos/id/1005/400/400'
        },
        {
            fullName: 'Sofia Lopez',
            dateOfBirth: '1995-07-20', // 29
            idNumber: '1.112.223.334',
            idPhotoUrl: 'https://picsum.photos/id/1011/400/400'
        }
    ],
    myInviteCodes: [
        { code: 'MYS-01', type: ProfileType.SINGLE, generatedBy: 'u2', expiresAt: '2025-01-01', isUsed: false },
        { code: 'MYS-02', type: ProfileType.SINGLE, generatedBy: 'u2', expiresAt: '2025-01-01', isUsed: false },
        { code: 'MYS-03', type: ProfileType.SINGLE, generatedBy: 'u2', expiresAt: '2025-01-01', isUsed: false },
        { code: 'MYS-04', type: ProfileType.SINGLE, generatedBy: 'u2', expiresAt: '2025-01-01', isUsed: false },
        { code: 'MYS-05', type: ProfileType.SINGLE, generatedBy: 'u2', expiresAt: '2025-01-01', isUsed: false },
    ]
  },
  {
    id: 'u3',
    nickname: 'NuevoUser_23',
    profileType: ProfileType.SINGLE,
    publicPhoto: 'https://picsum.photos/id/91/400/400',
    gallery: [],
    description: 'Recién llegado a la comunidad. Con ganas de aprender y respetar.',
    location: 'Cali',
    interests: ['Socializar', 'Eventos'],
    trustScore: 20,
    verificationLevel: 'Básico',
    isPremium: false,
    status: 'Pending',
    joinedDate: '2024-01-14',
    email: 'javit88@gmail.com',
    privateIdentity: [
        {
            fullName: 'Javier T.',
            dateOfBirth: '2000-01-01', // 24
            idNumber: '1.234.567.890',
            idPhotoUrl: 'https://picsum.photos/id/203/400/400'
        }
    ],
    myInviteCodes: [] // No codes until approved
  },
  {
    id: 'u4',
    nickname: 'VelvetRoom',
    profileType: ProfileType.BUSINESS,
    publicPhoto: 'https://picsum.photos/id/435/400/400',
    gallery: ['https://picsum.photos/id/440/800/600'],
    description: 'El club liberal más exclusivo. Noches temáticas y dress code estricto.',
    location: 'Cartagena',
    interests: ['Organización Eventos', 'Noche', 'Lujo'],
    trustScore: 98,
    verificationLevel: 'Alta Confianza',
    isPremium: true,
    status: 'Active',
    joinedDate: '2023-05-20',
    invitationQuota: 8,
    privateIdentity: [
        {
            fullName: 'Velvet Room SAS',
            dateOfBirth: '2019-01-01', // Foundation date
            idNumber: 'NIT 900.123.456',
            idPhotoUrl: 'https://picsum.photos/id/200/400/400'
        }
    ],
    myInviteCodes: [] // Businesses generate codes differently via quota
  }
];

export const POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'u4',
    content: '¡Esta noche tenemos "Masquerade Ball" en Velvet Room! 🎭 Dress code: Elegante + Antifaz. ¿Quién se apunta?',
    images: ['https://picsum.photos/id/429/800/600', 'https://picsum.photos/id/430/800/600'],
    likes: 124,
    comments: 18,
    timestamp: 'Hace 2 horas'
  },
  {
    id: 'u2',
    userId: 'u2',
    content: 'Recordando nuestra escapada del fin de semana. Buscando parejas afines en Medellín para tomar algo. 🥂',
    images: ['https://picsum.photos/id/1015/800/600'],
    likes: 89,
    comments: 12,
    timestamp: 'Hace 5 horas'
  },
  {
    id: 'u1',
    userId: 'u1',
    content: 'Nada mejor que sentirse libre. ✨',
    likes: 245,
    comments: 45,
    timestamp: 'Hace 1 día'
  }
];

export const VERIFICATIONS: VerificationRequest[] = [
  {
    id: 'v1',
    userId: 'u3',
    user: USERS.find(u => u.id === 'u3')!,
    submittedAt: '2024-01-14 10:30',
    status: 'Pending'
  },
  {
    id: 'v2',
    userId: 'u2',
    user: USERS.find(u => u.id === 'u2')!,
    submittedAt: '2023-11-15 14:20',
    status: 'Approved'
  }
];

export const EVENTS: Event[] = [
  {
    id: 'e1',
    creatorId: 'u4', // Created by VelvetRoom
    title: 'Noche de Networking Exclusivo',
    description: 'Un evento diseñado para conectar con las personalidades más influyentes de la comunidad en un ambiente relajado y seguro. Incluye barra libre de cócteles premium y canapés gourmet.',
    date: 'Sáb, 18 Ene',
    time: '21:00',
    location: 'Cartagena - Zona Amurallada',
    attendees: 24,
    maxAttendees: 50,
    soldCount: 24,
    isPremium: false,
    price: 150000, // COP
    image: 'https://picsum.photos/id/364/800/400'
  },
  {
    id: 'e2',
    creatorId: 'u4',
    title: 'Cena Privada Gourmet',
    description: 'Experiencia culinaria de 5 tiempos preparada por el chef invitado. Solo para parejas verificadas. Código de vestimenta: Formal.',
    date: 'Vie, 24 Ene',
    time: '20:30',
    location: 'Bogotá - Chapinero Alto',
    attendees: 14,
    maxAttendees: 20,
    soldCount: 14,
    isPremium: true,
    price: 600000, // COP
    image: 'https://picsum.photos/id/425/800/400'
  }
];

// Mock Tickets
export const TICKETS: Ticket[] = [
  {
    id: 't1',
    eventId: 'e1',
    userId: 'u1',
    eventName: 'Noche de Networking Exclusivo',
    eventDate: 'Sáb, 18 Ene - 21:00',
    eventLocation: 'Cartagena',
    quantity: 1,
    status: 'active',
    purchaseDate: '2024-01-12',
    pricePaid: 150000,
    commission: 12000 // 8% of 150000
  }
];

export const CODES: InvitationCode[] = [
  {
    code: 'TEST-SINGLE',
    type: ProfileType.SINGLE,
    generatedBy: 'SuperAdmin',
    expiresAt: '2025-12-31',
    isUsed: false
  },
  {
    code: 'TEST-COUPLE',
    type: ProfileType.COUPLE,
    generatedBy: 'SuperAdmin',
    expiresAt: '2025-12-31',
    isUsed: false
  },
  {
    code: 'TEST-BIZ',
    type: ProfileType.BUSINESS,
    generatedBy: 'SuperAdmin',
    expiresAt: '2025-12-31',
    isUsed: false
  },
  {
    code: 'VELVET-INV-01',
    type: ProfileType.SINGLE,
    generatedBy: 'u4', // Generated by Business
    expiresAt: '2024-03-01',
    isUsed: false
  }
];

export const CHATS: Record<string, ChatMessage[]> = {
  'u2': [ // Chat with MarcoYSofia
    {
      id: 'm1',
      senderId: 'u2',
      text: '¡Hola! Nos encantó tu perfil y que te guste el arte. ¿Sueles ir a eventos liberales?',
      timestamp: '10:30 AM',
      type: 'text'
    },
    {
      id: 'm2',
      senderId: 'me',
      text: 'Hola chicos, gracias. Sí, voy de vez en cuando a Velvet. ¿Vosotros?',
      timestamp: '10:35 AM',
      type: 'text'
    },
    {
      id: 'm3',
      senderId: 'u2',
      text: 'Vamos a menudo. Para que estés tranquila, aquí tienes nuestra verificación.',
      timestamp: '10:36 AM',
      type: 'text'
    },
    {
      id: 'm4',
      senderId: 'u2',
      text: '',
      timestamp: '10:36 AM',
      type: 'unlock_grant',
      unlockContent: {
        type: 'real_photo',
        value: 'https://picsum.photos/id/1011/400/400' // Real photo revealed
      }
    }
  ]
};