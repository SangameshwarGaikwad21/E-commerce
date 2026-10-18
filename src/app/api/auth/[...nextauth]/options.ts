import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
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

        const email = credentials.email.toLowerCase();

        const existingUser = await UserModel.findOne({ email });

        if (!existingUser?.password) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          existingUser.password
        );

        if (!isValid) return null;

        return {
          id: existingUser._id.toString(),
          email: existingUser.email,
          username: existingUser.username,
          role: existingUser.role,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google") {
        return true;
      }

      const googleProfile = profile as {
        email_verified?: boolean;
      } | undefined;

      if (!user.email || googleProfile?.email_verified !== true) {
        return false;
      }

      await connectionToDB();

      const email = user.email.toLowerCase();

      let dbUser = await UserModel.findOne({ email });

      if (!dbUser) {
      const username = user.name?.trim() || email.split("@")[0];
        dbUser = await UserModel.create({
          username,
          email,
          role: "user",
          authProvider: "google",
        });
      }
    user.id = dbUser._id.toString();
    return true;
    },

    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user?.email) {
        await connectionToDB();

        const dbUser = await UserModel.findOne({
          email: user.email.toLowerCase(),
        });

        if (dbUser) {
          token.id = dbUser._id.toString();
          token.username = dbUser.username;
          token.role = dbUser.role;
        }
      } else if (user) {
        token.id = user.id;
        token.username = (user as any).username;
        token.role = (user as any).role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
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