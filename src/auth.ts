import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/db"
import { accounts, sessions, users, verificationTokens } from "@/db/schema"

import type { Provider } from "next-auth/providers"

const providers: Provider[] = [
    Google({
        authorization: {
            params: {
                scope: "openid email profile https://www.googleapis.com/auth/photoslibrary.readonly",
                prompt: "consent",
                access_type: "offline",
                response_type: "code",
            },
        },
    }),
];

if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    providers.push(
        Credentials({
            id: "mock-login",
            name: "Mock Login",
            credentials: {},
            authorize: async () => {
                const mockUser = {
                    id: "mock-user-id",
                    name: "Mock User",
                    email: "mock@example.com",
                    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=MockUser",
                    username: "mockuser",
                };
                return mockUser;
            },
        })
    );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
    }),
    providers,
    callbacks: {
        async session({ session, user, token }) {
            if (session.user) {
                if (user?.username) {
                    // @ts-ignore
                    session.user.username = user.username;
                }

                // Handle mock user session
                if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' && token?.sub === "mock-user-id") {
                    // @ts-ignore
                    session.user.username = "mockuser";
                    session.user.id = "mock-user-id";
                } else if (user?.id) {
                    session.user.id = user.id;
                }
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        }
    },
    session: {
        strategy: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' ? "jwt" : "database",
    },
})
