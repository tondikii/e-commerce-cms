import {PrismaAdapter} from "@next-auth/prisma-adapter";
import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import prisma from "./prisma";
import {verifyPassword} from "./password";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {strategy: "jwt"},
  pages: {signIn: "/sign-in"},
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const {email, password} = credentials || {};

        if (!email || !password) {
          throw new Error("Email atau password belum dikirim.");
        }

        const user = await prisma.user.findUnique({
          where: {
            email,
            isAdmin: true,
          },
        });

        if (!user) {
          throw new Error("Email tidak ditemukan");
        }
        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {
          throw new Error("Password tidak sesuai");
        }

        // Return user data tanpa password
        const {password: _, ...userWithoutPassword} = user;
        return userWithoutPassword as any;
      },
    }),
  ],
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        // Tambahkan semua data user ke token kecuali password
        return {
          ...token,
          ...user,
        };
      }
      return token;
    },
    async session({session, token}) {
      // Hapus password dan field sensitif lainnya dari session
      const {password, iat, exp, jti, ...safeToken} = token;

      return {
        ...session,
        user: {
          ...session.user,
          ...safeToken,
        },
      };
    },
  },
};
