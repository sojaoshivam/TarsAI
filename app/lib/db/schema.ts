import { integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const userSystemsEnums = pgEnum('user_system_enum', ['system', 'user']);
export const subscriptionPlanEnum = pgEnum('subscription_plan', ['free', 'pro']);

export const chats = pgTable('chats', {
    id: serial('id').primaryKey(),
    pdfName: text('pdf_name').notNull(),
    pdfUrl: text('pdf_url').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    userId: varchar('user_id', { length: 256 }).notNull(),
    fileKey: text('file_key').notNull(),
})

export type DrizzleChat = typeof chats.$inferSelect;

export const messages = pgTable('messages', {
    id: serial('id').primaryKey(),
    chatId: integer('chat_id').references(() => chats.id).notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    role: userSystemsEnums('role').notNull()
})

export const userSubscriptions = pgTable('user_subscriptions', {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', { length: 256 }).notNull().unique(),
    stripeCustomerId: varchar('stripe_customer_id', { length: 256 }),
    stripeSubscriptionId: varchar('stripe_subscription_id', { length: 256 }),
    plan: subscriptionPlanEnum('plan').notNull().default('free'),
    currentPeriodEnd: timestamp('current_period_end'),
    pdfCount: integer('pdf_count').notNull().default(0),
    lastResetDate: timestamp('last_reset_date').defaultNow(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
})

export type DrizzleUserSubscription = typeof userSubscriptions.$inferSelect;