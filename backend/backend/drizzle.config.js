import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle/migration',
  schema: './drizzle/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
  },
});
