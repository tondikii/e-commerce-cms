// prisma.config.ts
import {defineConfig} from "prisma/config";
import path from "path";

export default defineConfig({
  schema: path.join(process.cwd(), "src/prisma/schema.prisma"),
  migrations: {
    seed: `tsx src/prisma/seed.ts`,
  },
});
