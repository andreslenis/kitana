import { User, UserRole, ProfileType, SubscriptionTier } from '../types';
import { USERS } from '../data';

// Response types
interface LoginResponse {
  success: boolean;
  user?: User;
  role: UserRole;
  error?: string;
}

// Simulated latency to mimic real network conditions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  auth: {
    login: async (pin: string): Promise<LoginResponse> => {
      await delay(600); // Network simulation

      // 1. System Roles (Hardcoded for MVP Phase 1, move to DB later)
      if (pin === '000000') {
        return { success: true, role: UserRole.ADMIN };
      }
      
      if (pin === '111111') {
        const verifier: User = {
            id: 'ver1', nickname: 'Agente 01', profileType: ProfileType.SINGLE,
            publicPhoto: '', gallery: [], description: '', location: '',
            interests: [], trustScore: 100, verificationLevel: 'Alta Confianza',
            verificationTier: 'L4: Premium (Video)',
            isPremium: true, status: 'Active', joinedDate: '2023-01-01',
            subscriptionTier: SubscriptionTier.SUPPORTER
        };
        return { success: true, user: verifier, role: UserRole.VERIFIER };
      }

      if (pin === '999999') {
        const moderator: User = {
            id: 'mod1', nickname: 'Moderador Global', profileType: ProfileType.SINGLE,
            publicPhoto: '', gallery: [], description: '', location: '',
            interests: [], trustScore: 100, verificationLevel: 'Alta Confianza',
            verificationTier: 'L4: Premium (Video)',
            isPremium: true, status: 'Active', joinedDate: '2023-01-01',
            subscriptionTier: SubscriptionTier.SUPPORTER
        };
        return { success: true, user: moderator, role: UserRole.MODERATOR };
      }

      // 2. User Lookup (Simulating SELECT * FROM Users WHERE pin = ?)
      let foundUser: User | undefined;
      
      // Mapping demo pins to IDs for the Mock Phase
      // In production, this would compare argon2(pin) with db.hash
      const pinMap: Record<string, string> = {
          '222222': 'u1',
          '555555': 'u2',
          '333333': 'u3',
          '444444': 'u4'
      };

      const userId = pinMap[pin];
      
      if (userId) {
          foundUser = USERS.find(u => u.id === userId);
      } else {
          // Fallback for new users created in-memory session
          // In production, this logic doesn't exist, as PINs are hashed in DB
          foundUser = USERS.find(u => u.id === pin); 
      }

      if (!foundUser) {
          return { success: false, role: UserRole.GUEST, error: 'Mmm, ese PIN no coincide. ¿Quizás un error de dedo?' };
      }

      // 3. Status Validation
      if (foundUser.status === 'Suspended') {
          return { success: false, role: UserRole.GUEST, error: 'Tu cuenta requiere atención administrativa. Por favor contacta a soporte.' };
      }

      if (foundUser.status === 'Pending') {
           // For the demo, we allow pending users to login to see a "limited" view or alert
           // But strictly speaking, they might be blocked. 
           // Let's return error for now as per original logic, or handle in UI.
           return { success: false, role: UserRole.GUEST, error: 'Estamos validando tu perfil para mantener la comunidad segura. Intenta más tarde.' };
      }

      return { success: true, user: foundUser, role: UserRole.USER };
    },

    register: async (newUser: User): Promise<boolean> => {
        await delay(800);
        // In production: await fetch('/api/auth/register', { method: 'POST', body: ... })
        USERS.push(newUser); // Mutating mock data for session
        return true;
    }
  },

  users: {
      getAll: async () => {
          await delay(300);
          return [...USERS];
      }
  }
};