import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!credentials?.username || !credentials?.password) return null;
        if (credentials.username !== adminUsername) return null;

        // Support both hashed and plain password (plain for easy setup)
        let passwordMatch = false;
        if (adminPasswordHash) {
          if (adminPasswordHash.startsWith('$2')) {
            passwordMatch = await bcrypt.compare(credentials.password, adminPasswordHash);
          } else {
            passwordMatch = credentials.password === adminPasswordHash;
          }
        }

        if (!passwordMatch) return null;

        return { id: '1', name: 'Admin', email: 'admin@cozystay.com' };
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
