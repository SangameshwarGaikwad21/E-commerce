import CredentialsProvider from "next-auth/providers/credentials";
import connectionToDB from "@/config/db";
import UserModel from "@/models/User.models";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          await connectionToDB();

          const userExisted = await UserModel.findOne({
            email: credentials.email.toLowerCase(),
          });

          if (!userExisted) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            userExisted.password
          );
          if (!isPasswordValid) {
            return null;
          }
          return {
            id: userExisted._id.toString(),
            email: userExisted.email,
            username: userExisted.username,
            password:userExisted.password,
            role: userExisted.role,
          };
        }
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
        token.email = (user as any).email;
        token.role = (user as any).role; 
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string; // ✅ exposed
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },
};