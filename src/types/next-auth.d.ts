// Declaration file to ensure next-auth types are properly recognized

declare module 'next-auth/react' {
  import { Session } from 'next-auth';
  
  export interface SessionContextValue {
    data: Session | null;
    status: 'loading' | 'authenticated' | 'unauthenticated';
    update: (data?: any) => Promise<Session | null>;
  }
  
  export function useSession(): SessionContextValue;
  export function signIn(provider?: string, options?: any): Promise<any>;
  export function signOut(options?: any): Promise<any>;
  export function getSession(options?: any): Promise<Session | null>;
} 