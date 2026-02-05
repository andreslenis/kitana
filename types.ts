export enum UserRole {
  ADMIN = 'ADMIN',
  VERIFIER = 'VERIFIER',
  USER = 'USER',
  GUEST = 'GUEST'
}

export enum ProfileType {
  SINGLE = 'Individual', // Persona
  COUPLE = 'Pareja',     // Pareja
  BUSINESS = 'Establecimiento' // Establecimiento (Club, Hotel, etc.)
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
  verificationLevel: 'Básico' | 'Verificado' | 'Alta Confianza';
  isPremium: boolean;
  
  // Private Layer (Only visible to Admin/Verifier)
  email?: string;
  privateNotes?: string;
  
  // Structured Private Identity (Supports 1 or 2 members)
  privateIdentity?: IdentityMember[];
  
  // System
  status: 'Active' | 'Pending' | 'Suspended';
  joinedDate: string;
  
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
}

export interface VerificationRequest {
  id: string;
  userId: string;
  user: User;
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  riskScore?: number;
}

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
  type: 'text' | 'unlock_request' | 'unlock_grant' | 'image';
  unlockContent?: {
    type: 'real_photo' | 'real_name' | 'phone';
    value: string;
  }
}