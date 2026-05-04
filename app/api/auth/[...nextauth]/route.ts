import GoogleProvider from "next-auth/providers/google"
import NextAuth from "next-auth"
import { db } from "@/db"

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account", // ✅ force account selection
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  database: process.env.DATABASE_URL,
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ profile }: { profile: { email: string; name: string; picture: string } }) {
      const userExists = await db.user.findFirst({
        where: { email: profile.email },
      })
      if (!userExists) {
        await db.user.create({
          data: {
            email: profile.email,
            username: profile.name,
            image: profile.picture,
          },
        })
      }
      return true
    },

    async session({ session }: { session: any }) {
      const user = await db.user.findFirst({
        where: { email: session.user.email },
      })
      if (user) session.user.id = user.id.toString()
      return session
    },
  },
}

const handler = NextAuth(authOptions as any)
export { handler as GET, handler as POST }