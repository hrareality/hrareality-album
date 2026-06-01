import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { getUser, createUser } from "./airtable";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "identify",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "discord" && profile) {
        const discordProfile = profile as any;
        // Discord API v10 poskytuje ID v profile.id, uživatelské jméno v profile.username atd.
        const discordId = (discordProfile.id || user.id) as string;
        const username = (discordProfile.username || user.name || `User_${discordId.slice(-4)}`) as string;
        const discriminator = (discordProfile.discriminator as string) || "0000";
        
        // Získání URL avataru z profilu Discordu
        let avatarUrl = user.image || "";
        if (discordProfile.id && discordProfile.avatar) {
          const isGif = String(discordProfile.avatar).startsWith("a_");
          avatarUrl = `https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}.${isGif ? "gif" : "png"}`;
        }

        try {
          // Synchronizace s Airtable databází
          const existingUser = await getUser(discordId);
          if (!existingUser) {
            await createUser({
              discord_id: discordId,
              username,
              discriminator,
              avatar_url: avatarUrl,
            });
          }
        } catch (error) {
          console.error("[NextAuth Callback] Chyba synchronizace uživatele v Airtable:", error);
        }
      }
      return true;
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const discordProfile = profile as any;
        token.discordId = discordProfile.id || account.providerAccountId;
        token.username = discordProfile.username || token.name || `User_${String(token.discordId).slice(-4)}`;
        
        let avatarUrl = token.picture || "";
        if (discordProfile.id && discordProfile.avatar) {
          const isGif = String(discordProfile.avatar).startsWith("a_");
          avatarUrl = `https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}.${isGif ? "gif" : "png"}`;
        }
        token.avatarUrl = avatarUrl;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // Rozšíření standardní session o Discord atributy
        (session.user as any).discordId = token.discordId as string;
        (session.user as any).username = token.username as string;
        (session.user as any).avatarUrl = token.avatarUrl as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  secret: process.env.AUTH_SECRET,
});
