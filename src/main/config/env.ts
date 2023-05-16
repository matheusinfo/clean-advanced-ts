export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '',
    clientSecret: process.env.FB_CLIENT_SECRET ?? ''
  },
  app: {
    port: process.env.PORT ?? 8080,
    jwtSecret: process.env.JWT_SECRET ?? 'cahuh#@@'
  },
  db: {
    postgresMain: {
      host: process.env.POSTGRES_HOST ?? 'localhost',
      port: process.env.POSTGRES_PORT ?? 5432,
      username: process.env.POSTGRES_USERNAME ?? 'postgres',
      password: process.env.POSTGRES_PASSWORD ?? 'postgres',
      database: process.env.POSTGRES_DATABASE ?? 'postgres'
    }
  }
}
