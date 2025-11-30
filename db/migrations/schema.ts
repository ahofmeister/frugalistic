import {
  bigint,
  boolean,
  check,
  date,
  doublePrecision,
  foreignKey,
  integer,
  numeric,
  pgEnum,
  pgPolicy,
  pgTable,
  pgView,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "@/db/migrations/auth-schema";

export const feedbackStatus = pgEnum("feedback_status", [
  "new",
  "resolved",
  "closed",
]);
export const onboardingStatus = pgEnum("onboarding_status", [
  "current",
  "complete",
  "skip",
  "open",
]);
export const onboardingStep = pgEnum("onboarding_step", [
  "categories",
  "welcome",
]);
export const recurringInterval = pgEnum("recurring_interval", [
  "monthly",
  "annually",
]);
export const transactionType = pgEnum("transaction_type", [
  "income",
  "expense",
  "savings",
]);

export const favoriteSchema = pgTable(
  "favorite",
  {
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    description: varchar().notNull(),
    userId: uuid("user_id")
      .default(
        sql`auth
                .
                uid
                ()`,
      )
      .notNull(),
    amount: integer().notNull(),
    type: transactionType().notNull(),
    id: uuid().defaultRandom().primaryKey().notNull(),
    category: uuid(),
  },
  (table) => [
    foreignKey({
      columns: [table.category],
      foreignColumns: [categories.id],
      name: "favorite_category_fkey",
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "favorite_user_id_fkey",
    }).onDelete("cascade"),
    pgPolicy("User can see favorites", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(auth.uid()
                       = user_id)`,
      withCheck: sql`(auth.uid()
                           = user_id)`,
    }),
    check(
      "disallow_empty",
      sql`(description)
                ::text <> ''::text`,
    ),
  ],
);

export const categories = pgTable(
  "categories",
  {
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    name: text().notNull(),
    color: text().notNull(),
    userId: uuid("user_id")
      .default(
        sql`auth
                .
                uid
                ()`,
      )
      .notNull(),
    id: uuid().defaultRandom().primaryKey().notNull(),
    description: text(),
    icon: text(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "categories_user_id_fkey",
    }).onDelete("cascade"),
    pgPolicy("user's categories", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(auth.uid()
                       = user_id)`,
      withCheck: sql`(auth.uid()
                           = user_id)`,
    }),
  ],
);

export const transactions = pgTable(
  "transactions",
  {
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    description: varchar().notNull(),
    datetime: date().defaultNow().notNull(),
    userId: uuid("user_id")
      .default(
        sql`auth
                .
                uid
                ()`,
      )
      .notNull(),
    amount: integer().notNull(),
    type: transactionType().notNull(),
    id: uuid().defaultRandom().primaryKey().notNull(),
    category: uuid(),
    recurringTransaction: uuid("recurring_transaction"),
  },
  (table) => [
    foreignKey({
      columns: [table.category],
      foreignColumns: [categories.id],
      name: "transactions_category_fkey",
    }),
    foreignKey({
      columns: [table.recurringTransaction],
      foreignColumns: [transactionsRecurring.id],
      name: "transactions_recurring_transaction_fkey",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "transactions_user_id_fkey",
    }).onDelete("cascade"),
    pgPolicy("user's transaction only", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(auth.uid()
                       = user_id)`,
      withCheck: sql`(auth.uid()
                           = user_id)`,
    }),
    check(
      "disallow_empty",
      sql`(description)
                ::text <> ''::text`,
    ),
  ],
);

export const transactionsRecurring = pgTable(
  "transactions_recurring",
  {
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    description: varchar().notNull(),
    nextRun: date("next_run"),
    userId: uuid("user_id").notNull(),
    amount: doublePrecision().notNull(),
    type: transactionType().notNull(),
    id: uuid().defaultRandom().primaryKey().notNull(),
    enabled: boolean().default(true).notNull(),
    interval: recurringInterval().notNull(),
    category: uuid(),
  },
  (table) => [
    foreignKey({
      columns: [table.category],
      foreignColumns: [categories.id],
      name: "transactions_recurring_category_fkey",
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "transactions_recurring_user_id_fkey",
    }).onDelete("cascade"),
    pgPolicy("Allow users to delete their own entries", {
      as: "permissive",
      for: "delete",
      to: ["public"],
      using: sql`(user_id = auth.uid())`,
    }),
    pgPolicy("Allow users to insert a new entry", {
      as: "permissive",
      for: "insert",
      to: ["public"],
    }),
    pgPolicy("Allow users to read their own entries", {
      as: "permissive",
      for: "select",
      to: ["public"],
    }),
    pgPolicy("Allow users to update their own entries", {
      as: "permissive",
      for: "update",
      to: ["public"],
    }),
    check(
      "disallow_empty",
      sql`(description)
                ::text <> ''::text`,
    ),
  ],
);

export const setting = pgTable(
  "setting",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    dateFormat: text("date_format").default("dd.MM.yyyy").notNull(),
    userId: uuid("user_id")
      .default(
        sql`auth
                .
                uid
                ()`,
      )
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "setting_user_id_fkey",
    }).onDelete("cascade"),
    unique("setting_user_id_key").on(table.userId),
    pgPolicy("Allow users to delete their own entries", {
      as: "permissive",
      for: "delete",
      to: ["public"],
      using: sql`(user_id = auth.uid())`,
    }),
    pgPolicy("Allow users to insert a new entry", {
      as: "permissive",
      for: "insert",
      to: ["public"],
    }),
    pgPolicy("Allow users to read their own entries", {
      as: "permissive",
      for: "select",
      to: ["public"],
    }),
    pgPolicy("Allow users to update their own entries", {
      as: "permissive",
      for: "update",
      to: ["public"],
    }),
  ],
);

export const feedback = pgTable(
  "feedback",
  {
    id: uuid()
      .default(
        sql`uuid_generate_v4
                ()`,
      )
      .primaryKey()
      .notNull(),
    userId: uuid("user_id").default(sql`auth
        .
        uid
        ()`),
    text: text().notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    status: text().default("New"),
    response: text(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "feedback_user_id_fkey",
    }).onDelete("cascade"),
    pgPolicy("Allow users to delete their own entries", {
      as: "permissive",
      for: "delete",
      to: ["public"],
      using: sql`(user_id = auth.uid())`,
    }),
    pgPolicy("Allow users to insert a new entry", {
      as: "permissive",
      for: "insert",
      to: ["public"],
    }),
    pgPolicy("Allow users to read their own entries", {
      as: "permissive",
      for: "select",
      to: ["public"],
    }),
    pgPolicy("Allow users to update their own entries", {
      as: "permissive",
      for: "update",
      to: ["public"],
    }),
    check(
      "feedback_status_check",
      sql`status
            = ANY (ARRAY['New'::text, 'In Progress'::text, 'Resolved'::text, 'Closed'::text])`,
    ),
  ],
);

export const profile = pgTable(
  "profile",
  {
    id: uuid()
      .default(
        sql`auth
                .
                uid
                ()`,
      )
      .primaryKey()
      .notNull(),
    firstName: text(),
    lastName: text(),
    email: text(),
  },
  (table) => [
    foreignKey({
      columns: [table.id],
      foreignColumns: [users.id],
      name: "profiles_id_fkey",
    }).onDelete("cascade"),
    unique("user_id_key").on(table.id),
    unique("user_email_key").on(table.email),
    pgPolicy("user's profile", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(auth.uid()
                       = id)`,
      withCheck: sql`(auth.uid()
                           = id)`,
    }),
  ],
);
export const transactionAutoSuggest = pgView("transaction_auto_suggest", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  uniqueId: bigint("unique_id", { mode: "number" }),
  description: text(),
  type: transactionType(),
  category: uuid(),
  name: text(),
  color: text(),
  frequency: numeric(),
}).with({ securityInvoker: true }).as(sql`WITH category_counts
                                                 AS (SELECT TRIM(BOTH FROM t_1.description) AS description,
                                                            t_1.type,
                                                            c.id                            AS category,
                                                            c.name,
                                                            c.color,
                                                            count(*)                        AS frequency,
                                                            row_number()                       OVER (PARTITION BY (TRIM(BOTH FROM t_1.description)), t_1.type ORDER BY (count(*)) DESC) AS rn
                                                     FROM transactions t_1
                                                              JOIN categories c ON c.id = t_1.category
                                                     GROUP BY (TRIM(BOTH FROM t_1.description)), t_1.type, c.id,
                                                              c.name, c.color),
                                             totals AS (SELECT category_counts.description,
                                                               category_counts.type,
                                                               sum(category_counts.frequency) AS total_frequency
                                                        FROM category_counts
                                                        GROUP BY category_counts.description, category_counts.type)
                                        SELECT row_number()         OVER (ORDER BY t.total_frequency DESC, cc.description) AS unique_id, cc.description,
                                               cc.type,
                                               cc.category,
                                               cc.name,
                                               cc.color,
                                               t.total_frequency AS frequency
                                        FROM category_counts cc
                                                 JOIN totals t ON cc.description = t.description AND cc.type = t.type
                                        WHERE cc.rn = 1
                                        ORDER BY t.total_frequency DESC, cc.description`);
