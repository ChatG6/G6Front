import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { login } from "@/app/lib/Auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/app/lib/db";
import { User } from "@prisma/client";

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "G6 Account",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        const resp = await login(
          credentials?.username as string,
          credentials?.password as string
        );
        console.log(resp.data.token);
        const user: User = {
          id: resp.data.userId,
          name: credentials?.username as string,
          email: resp.data.email,
          emailVerified: null,
          password: null,
          image: "",
          token: null,
          isVerified: true,
          expirationTime: null,
          freequota: 5,
          freequotaplg: 5
        };
        if (resp.status === 200) {
          return user;
        }
        return null;
      },
    }),
    GoogleProvider({
      id: "google",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    })
  ],
  pages: {
    signIn: "/authentication/login",
    signOut: "/authentication/signout",
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 3600,
  },
  callbacks: {
    jwt: async ({ token, user}) => {  
      console.log(user)
      if(user){    
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token?.name) {
        session.user = {
          name: token.name,
          email: token.email,
          image: token.picture,
        };
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      console.log("Signed in");
    },
    async signOut() {
      console.log("Signed out");
    },
  },
};
