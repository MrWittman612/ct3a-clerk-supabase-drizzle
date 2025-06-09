// import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  out: "./src/server/db/migration",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["ct3a-clerk-supabase-drizzle_*"],
} as const;
