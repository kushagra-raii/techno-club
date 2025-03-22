import NextAuth, { NextAuthOptions } from 'next-auth';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { connectToDatabase } from '@/lib/mongoose';
import User, { UserRole, ClubType } from '@/lib/models/User';

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'user' as UserRole, // Default role for Google sign-in
          club: '' as ClubType, // Default empty club for Google sign-in
          creditScore: 0, // Default credit score for Google sign-in
        };
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        await connectToDatabase();
        
        const user = await User.findOne({ email: credentials.email }).lean();
        
        if (!user || !user.password) {
          return null;
        }
        
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        
        if (!isPasswordValid) {
          return null;
        }
        
        // Convert Mongoose document to plain object
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image || '',
          role: user.role,
          club: (user.club || '') as ClubType,
          creditScore: user.creditScore || 0,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role as UserRole;
        token.id = user.id;
        token.club = user.club as ClubType;
        token.creditScore = user.creditScore;
      } else if (token.email) {
        // If we have a token but no user (e.g., after refresh), fetch the latest role
        await connectToDatabase();
        const dbUser = await User.findOne({ email: token.email }).lean();
        if (dbUser) {
          token.role = dbUser.role;
          token.id = dbUser._id.toString();
          token.club = dbUser.club;
          token.creditScore = dbUser.creditScore;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as UserRole;
        session.user.id = token.id as string;
        session.user.club = (token.club || '') as ClubType;
        session.user.creditScore = token.creditScore as number || 0;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 