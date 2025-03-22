import 'next-auth';
import { UserRole, ClubType } from '../models/User';

declare module 'next-auth' {
  interface User {
    id: string;
    role?: UserRole;
    club?: ClubType;
    creditScore?: number;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      role: UserRole;
      club: ClubType;
      creditScore: number;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role?: UserRole;
    club?: ClubType;
    creditScore?: number;
  }
} 