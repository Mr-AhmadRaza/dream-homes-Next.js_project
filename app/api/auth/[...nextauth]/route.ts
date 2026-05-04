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
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ profile }: { profile?: any }) {
      try {
        if (!profile?.email) return false
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
      } catch (error) {
        console.error("SignIn error:", error)
        return false
      }
    },
    async session({ session }: { session: any }) {
      try {
        const user = await db.user.findFirst({
          where: { email: session.user.email },
        })
        if (user) session.user.id = user.id.toString()
        return session
      } catch (error) {
        console.error("Session error:", error)
        return session
      }
    },
  },
}

const handler = NextAuth(authOptions as any)
export { handler as GET, handler as POST }