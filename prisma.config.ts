import path from "node:path";
import {defineConfig} from "prisma/config";

// prisma.config.ts
import {config} from "dotenv";

// Load environment variables
config();

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    seed: `tsx src/prisma/seed.ts`,
  },
});
