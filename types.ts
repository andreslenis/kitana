export enum UserRole {
  ADMIN = 'ADMIN',
  VERIFIER = 'VERIFIER',
  MODERATOR = 'MODERATOR', // New Role
  USER = 'USER',
  GUEST = 'GUEST'
}

export enum ProfileType {
  SINGLE = 'Individual', // Persona
  COUPLE = 'Pareja',     // Pareja
  BUSINESS = 'Establecimiento' // Establecimiento (Club, Hotel, etc.)
}

export enum SubscriptionTier {
  // Consumer Tiers
  FREE = 'FREE',
  SUPPORTER = 'SUPPORTER', // $49.99/yr
  
  // Business Tiers
  BIZ_BASIC = 'BIZ_BASIC',         // Tier 1: Gratis, 18% comm
  BIZ_PROFESSIONAL = 'BIZ_PROFESSIONAL', // Tier 2: $99/mo, 12% comm
  BIZ_ELITE = 'BIZ_ELITE',         // Tier 3: $299/mo, 6% comm
  BIZ_ENTERPRISE = 'BIZ_ENTERPRISE' // Tier 4: Custom
}

export interface IdentityMember {
  fullName: string;
  dateOfBirth: string; // YYYY-MM-DD
  idNumber: string;
  idPhotoUrl: string; // URL to the ID document image
}

export interface InvitationCode {
  code: string;
  type: ProfileType;
  generatedBy: string; // 'SuperAdmin' or User ID (Business/User)
  expiresAt: string;
  isUsed: boolean;
  usedBy?: string;
}

export type VerificationTier = 
  | 'L0: Unverified' 
  | 'L1: Básico (Email/Tel)' 
  | 'L2: Identidad (ID+Selfie)' 
  | 'L3: Humano (Revisión)' 
  | 'L4: Premium (Video)';

export interface User {
  id: string;
  // Public Layer
  nickname: string;
  profileType: ProfileType;
  publicPhoto: string;
  gallery: string[]; // User uploaded public photos
  description: string;
  location: string;
  interests: string[]; 
  trustScore: number; // 0-100
  
  // Legacy mapping: L0/L1 -> Básico, L2 -> Verificado, L3/L4 -> Alta Confianza
  verificationLevel: 'Básico' | 'Verificado' | 'Alta Confianza'; 
  verificationTier: VerificationTier; // New granular level

  isPremium: boolean; // Legacy flag, now computed from subscriptionTier !== FREE
  subscriptionTier: SubscriptionTier; // New Monetization Field
  
  badges?: string[]; // Gamification Badges (e.g., "Social Butterfly")

  // Private Layer (Only visible to Admin/Verifier)
  email?: string;
  phoneNumber?: string; // Added for L1
  privateNotes?: string;
  
  // Structured Private Identity (Supports 1 or 2 members)
  privateIdentity?: IdentityMember[];
  
  // System
  status: 'Active' | 'Pending' | 'Suspended';
  joinedDate: string;
  
  // Moderation
  reportsReceived?: number; // For TrustScore calc
  strikes?: number; // Warning count
  isShadowBanned?: boolean; // Visibility restriction

  // Codes
  myInviteCodes?: InvitationCode[]; // The 5 codes they own to share
  invitationQuota?: number; // Legacy/Business quota
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  images?: string[]; // Updated to array, max 3
  likes: number;
  comments: number;
  timestamp: string;
  isStory?: boolean; // Ephemeral content
}

export interface VerificationRequest {
  id: string;
  userId: string;
  user: User;
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  riskScore?: number;
  // Added for AI Analysis context
  selfieUrl?: string; 
}

// --- MODERATION SYSTEM ---
export enum ReportCategory {
  FAKE_PROFILE = 'Perfil Falso / Suplantación',
  NON_CONSENSUAL = 'Contenido No Consensuado (Revenge Porn)',
  UNDERAGE = 'Menores de Edad / CSAM',
  HARASSMENT = 'Acoso / Hostigamiento',
  SCAM = 'Estafa / Spam Comercial',
  TERMS_VIOLATION = 'Violación de Términos'
}

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  category: ReportCategory;
  description: string;
  evidenceImages?: string[]; // Screenshots or flagged content
  timestamp: string;
  status: 'Pending' | 'Resolved' | 'Dismissed';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  adminNotes?: string;
}
// -------------------------

export interface Event {
  id: string;
  creatorId: string; // Link to establishment
  title: string;
  description?: string; // Added description
  date: string;
  time: string;
  location: string;
  image: string;
  attendees: number;
  maxAttendees: number; // Capacity
  isPremium: boolean;
  
  // Commerce
  price: number; // 0 for free
  soldCount: number;
  salesDeadline?: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  quantity: number; // Added quantity
  status: 'active' | 'used';
  purchaseDate: string;
  pricePaid: number;
  commission: number; // 8% fee
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  type: 'text' | 'unlock_request' | 'unlock_grant' | 'image' | 'audio' | 'location';
  isEphemeral?: boolean;
  expiresInSeconds?: number;
  unlockContent?: {
    type: 'real_photo' | 'real_name' | 'phone';
    value: string;
  };
  mediaUrl?: string; // For audio/image
  locationData?: { lat: number, lng: number, label: string };
}