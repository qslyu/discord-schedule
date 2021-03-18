import NextAuth from 'next-auth'
import { signIn } from 'next-auth/client'
import Providers from 'next-auth/providers'

export default NextAuth({
  providers: [
    {
      id: 'discord',
      name: 'Discord',
      type: 'oauth',
      version: '2.0',
      scope: 'identify email',
      params: { grant_type: 'authorization_code' },
      accessTokenUrl: 'https://discord.com/api/oauth2/token',
      authorizationUrl: 'https://discord.com/api/oauth2/authorize?response_type=code&prompt=none',
      profileUrl: 'https://discord.com/api/users/@me',
      profile: (profile) => {
        if (profile.avatar === null) {
          const defaultAvatarNumber = parseInt(profile.discriminator) % 5
          profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`
        } else {
          const format = profile.avatar.startsWith('a_') ? 'gif' : 'png'
          profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`
        }
        return {
          id: profile.id,
          name: `${profile.username}#${profile.discriminator}`,
          image: profile.image_url,
          email: profile.email
        }
      },
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET
    }
  ],

  events: {
    async signIn(message) {
      // Update profile
    }
  },

  callbacks: {
    async session(session, user) {
      session.user.uid = user.uid
      return Promise.resolve(session)
    },

    async jwt(token, user, account, profile, isNewUser) {
      if(user) {
        token.uid = user.id
      }
      return Promise.resolve(token)
    }
  },

  session: {
    jwt: true, 
  },

  jwt: {
    signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
  },
  
  database: process.env.DATABASE_URL,
})