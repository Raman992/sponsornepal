/**
 * seed-auth.ts
 *
 * Creates auth users via Supabase Admin API and outputs their UUIDs
 * for use in seed.sql.
 *
 * Usage:
 *   npx tsx database/seeds/seed-auth.ts
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Load env from .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    process.env[key] = value;
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

interface SeedUser {
  email: string;
  password: string;
  full_name: string;
  role: "admin" | "creator" | "brand";
  expectedId: string;
}

const SEED_USERS: SeedUser[] = [
  {
    email: "admin@sponsornepal.com",
    password: "Admin@123",
    full_name: "SponsorNepal Admin",
    role: "admin",
    expectedId: "00000000-0000-0000-0000-000000000001",
  },
  {
    email: "ram@example.com",
    password: "Creator@123",
    full_name: "Ram Thapa",
    role: "creator",
    expectedId: "10000000-0000-0000-0000-000000000001",
  },
  {
    email: "sita@example.com",
    password: "Creator@123",
    full_name: "Sita Maharjan",
    role: "creator",
    expectedId: "10000000-0000-0000-0000-000000000002",
  },
  {
    email: "bikash@example.com",
    password: "Creator@123",
    full_name: "Bikash Shrestha",
    role: "creator",
    expectedId: "10000000-0000-0000-0000-000000000003",
  },
  {
    email: "anita@example.com",
    password: "Creator@123",
    full_name: "Anita Gurung",
    role: "creator",
    expectedId: "10000000-0000-0000-0000-000000000004",
  },
  {
    email: "priya@example.com",
    password: "Creator@123",
    full_name: "Priya Tamang",
    role: "creator",
    expectedId: "10000000-0000-0000-0000-000000000005",
  },
  {
    email: "ncell@ncell.com.np",
    password: "Brand@123",
    full_name: "Ncell Team",
    role: "brand",
    expectedId: "20000000-0000-0000-0000-000000000001",
  },
  {
    email: "daraz@daraz.com.np",
    password: "Brand@123",
    full_name: "Daraz Nepal",
    role: "brand",
    expectedId: "20000000-0000-0000-0000-000000000002",
  },
  {
    email: "imepay@imepay.com.np",
    password: "Brand@123",
    full_name: "IME Pay Team",
    role: "brand",
    expectedId: "20000000-0000-0000-0000-000000000003",
  },
  {
    email: "foodmandu@foodmandu.com.np",
    password: "Brand@123",
    full_name: "Foodmandu Marketing",
    role: "brand",
    expectedId: "20000000-0000-0000-0000-000000000004",
  },
];

async function main() {
  console.log("Creating auth users via Supabase Admin API...\n");

  const idMapping: Record<string, string> = {};

  for (const user of SEED_USERS) {
    try {
      // Check if user already exists
      const { data: existing } = await supabase.auth.admin.listUsers();
      const found = existing?.users?.find((u) => u.email === user.email);

      if (found) {
        console.log(`  [EXISTS] ${user.email} -> ${found.id}`);
        idMapping[user.expectedId] = found.id;
        continue;
      }

      // Create user with fixed UUID
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.full_name,
          role: user.role,
        },
        // Use the expected ID so seed.sql UUIDs match
      });

      if (error) {
        // Try with the expected ID
        const { data: data2, error: error2 } =
          await supabase.auth.admin.createUser({
            id: user.expectedId,
            email: user.email,
            password: user.password,
            email_confirm: true,
            user_metadata: {
              full_name: user.full_name,
              role: user.role,
            },
          });

        if (error2) {
          console.error(`  [ERROR] ${user.email}: ${error2.message}`);
          continue;
        }

        console.log(`  [CREATED] ${user.email} -> ${data2.user?.id}`);
        if (data2.user) idMapping[user.expectedId] = data2.user.id;
      } else {
        console.log(`  [CREATED] ${user.email} -> ${data.user?.id}`);
        if (data.user) idMapping[user.expectedId] = data.user.id;
      }
    } catch (err: any) {
      console.error(`  [ERROR] ${user.email}: ${err.message}`);
    }
  }

  // Output ID mapping
  console.log("\n--- Auth User ID Mapping ---\n");
  let needsUpdate = false;

  for (const user of SEED_USERS) {
    const actualId = idMapping[user.expectedId];
    if (actualId && actualId !== user.expectedId) {
      needsUpdate = true;
      console.log(
        `  ${user.email}: expected ${user.expectedId} -> actual ${actualId}`
      );
    } else if (actualId) {
      console.log(`  ${user.email}: ${actualId} (matches expected)`);
    } else {
      console.log(`  ${user.email}: FAILED TO CREATE`);
    }
  }

  if (needsUpdate) {
    console.log(
      "\n⚠️  Some UUIDs don't match expected values."
    );
    console.log(
      "   Update seed.sql with the actual UUIDs above before running it.\n"
    );
  } else {
    console.log(
      "\n✅ All auth users created with expected UUIDs. You can now run seed.sql.\n"
    );
  }
}

main().catch(console.error);
