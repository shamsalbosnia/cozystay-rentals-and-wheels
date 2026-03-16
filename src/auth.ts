import type { AuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { getServerSession } from 'next-auth';
import { createSupabaseServerClient } from './lib/supabaseServer';
import bcrypt from 'bcryptjs';

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const supabase = createSupabaseServerClient();

          const { data: adminUser, error } = await supabase
            .from('admins')
            .select('*')
            .eq('email', credentials.email)
            .single();

          if (error || !adminUser) {
            return null;
          }

          const hash = adminUser.password_hash || adminUser.password;

          if (!hash) {
            return null;
          }

          let isValidPassword = false;

          if (hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$')) {
            isValidPassword = await bcrypt.compare(credentials.password as string, hash);
          } else {
            isValidPassword = credentials.password === hash;
          }

          if (!isValidPassword) {
            return null;
          }

          return {
            id: adminUser.id,
            email: adminUser.email,
            role: adminUser.role || 'admin',
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
};

export const getAuthHandler = () => NextAuth(authOptions);

export async function auth() {
  return getServerSession(authOptions);
}
