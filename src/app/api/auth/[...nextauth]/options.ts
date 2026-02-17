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

      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("All fields are required");
        }

        await connectionToDB();
        try {
            const userExisted = await UserModel.findOne({
                email: credentials.email,
            });

        if (!userExisted) {
          throw new Error("User not registered");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          userExisted.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }
        return {
          id: userExisted._id.toString(), 
          email: userExisted.email,
          username: userExisted.username,
        };   
        } 
        catch (error) {
            console.log("Auth error:", error);
            return null;
        }
      },
    }),
  ],
  callbacks:{
    async jwt({token,user}) {
        if(user){
            token.id = user.id,
            token.username = user.username,
            token.email = user.email
        }
        return token
    },
    async session({session,token}){
        if(session.user){
            session.user.id = token.id as string;
            session.user.username = token.username as string;
            session.user.email = token.email as string;
        }
        return session
    }
  },
  session:{
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/sign-in"
  }
};
