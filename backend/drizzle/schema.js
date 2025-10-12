// import { relations, sql } from "drizzle-orm"
// import { boolean, float, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core"


// export const productsTable = mysqlTable("products", {
//     id: int().autoincrement().primaryKey(),
//     name: varchar({ length: 255 }).notNull(),
//     category: varchar({ length: 255 }).notNull(),
//     description: varchar({ length: 255 }).notNull(),
//     price: int().notNull(),
//     originalPrice: int("original_price").notNull(),
//     ratings: float().notNull(),
//     image: text(),
//     isAvailable: boolean().default(true).notNull()
// })

// export const cartItemsTable = mysqlTable("cart_items", {
//     id: int().autoincrement().primaryKey(),
//     itemId: int("item_id").notNull().references(() => productsTable.id),
//     quantity: int().notNull(),
//     createdAt: timestamp("created_at").defaultNow().notNull(),
//     updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
//     userId: int("user_id").notNull().references(() => usersTable.id),
// })

// export const sessionsTable = mysqlTable("sessions", {
//     id: int().autoincrement().primaryKey(),
//     userId: int("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade"}),
//     valid: boolean().default(true).notNull(),
//     userAgent: text("user_agent"),
//     ip: varchar({ length: 255 }),
//     createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: "string" }).default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
// })

// export const ordersTable = mysqlTable("orders", {
//     id: int().autoincrement().primaryKey(),
//     userId: int("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade"}),
//     amount: int().notNull(),
//     firstName: varchar("first_name", { length: 255 }).notNull(),
//     lastName: varchar("last_name", { length: 255 }).notNull(),
//     email: varchar({ length: 255 }).notNull(),
//     street: varchar({ length: 255 }).notNull(),
//     city: varchar({ length: 255 }).notNull(),
//     state: varchar({ length: 255 }).notNull(),
//     zipCode: int("zip_code").notNull(),
//     country: varchar({ length: 255 }).notNull(),
//     phone: varchar({ length: 255 }).notNull(),
//     status: varchar({ length: 255 }).notNull(),
//     payment: boolean().default(false).notNull(),
//     createdAt: timestamp("created_at").defaultNow().notNull(),
//     updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
// })

// export const orderItemsTable = mysqlTable("order_items", {
//     id: int().autoincrement().primaryKey(),
//     orderId: int("order_id").notNull().references(() => ordersTable.id, { onDelete: "cascade"}),
//     productId: int("product_id").notNull().references(() => productsTable.id, { onDelete: "cascade"}),
//     quantity: int().notNull(),
//     price: int().notNull()
// })

// export const contactsTable = mysqlTable("contacts", {
//     id: int().autoincrement().primaryKey(),
//     fullName: varchar({ length: 255 }).notNull(),
//     email: varchar({ length: 255 }).notNull(),
//     subject: varchar({ length: 255 }).notNull(),
//     message: varchar({ length: 255 }).notNull(),
// })

// export const verifyEmailTokenTable = mysqlTable("verify_email_token", {
//     id: int().autoincrement().primaryKey(),
//     userId: int("user_id").notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
//     token: varchar({length: 8}).notNull(),
//     expiresAt: timestamp("expires_at").default(sql`(CURRENT_TIMESTAMP + INTERVAL 1 DAY)`).notNull(),
//     createdAt: timestamp("created_at").defaultNow().notNull(),
// })

// export const resetPasswordTokenTable = mysqlTable("reset_password_token", {
//     id: int().autoincrement().primaryKey(),
//     userId: int("user_id").notNull().references(() => usersTable.id, {onDelete : 'cascade'}).unique(),
//     tokenHash: text("token_hash").notNull(),
//     expiresAt: timestamp("expires_at").default(sql`(CURRENT_TIMESTAMP + INTERVAL 1 HOUR)`).notNull(),
//     createdAt: timestamp("created_at").defaultNow().notNull(),
// })

// export const oauthAccountsTable = mysqlTable("oauth_accounts", {
//   id: int("id").autoincrement().primaryKey(),
//   userId: int("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
//   provider: mysqlEnum("provider", ["google", "github"]).notNull(),
//   providerAccountId: varchar("provider_account_id", {length : 255}).notNull().unique(),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
// });

// export const usersTable = mysqlTable("users", {
//     id: int().autoincrement().primaryKey(),
//     name: varchar({ length: 255 }).notNull(),
//     email: varchar({ length: 255 }).notNull().unique(),
//     password: varchar({ length: 255 }),
//     avatarUrl: text("avatar_url"),
//     isEmailValid: boolean("is_email_valid").default(false).notNull(),
//     isBlocked: boolean("is_blocked").default(false).notNull(),
//     createdAt: timestamp("created_at").defaultNow().notNull(),
//     updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
// });

// export const usersRelation = relations(usersTable, ({many}) => ({
//     cartItems: many(cartItemsTable),
//     sessions: many(sessionsTable),
// }))

// export const productsRelation = relations(productsTable, ({many}) => ({
//     cartItems: many(cartItemsTable),
// }))

// export const cartItemsRelation = relations(cartItemsTable, ({one}) => ({
//     users: one(usersTable, {
//         fields: [cartItemsTable.userId],
//         references: [usersTable.id],
//     }),
//     products: one(productsTable, {
//         fields: [cartItemsTable.itemId],
//         references: [productsTable.id],
//     })
// }))

// export const sessionsRelation = relations(sessionsTable, ({one}) => ({
//     users: one(usersTable, {
//         fields: [sessionsTable.userId],
//         references: [usersTable.id],
//     })
// }))

// export const ordersRelation = relations(ordersTable, ({many, one}) => ({
//     user: one(usersTable, {
//         fields: [ordersTable.userId],
//         references: [usersTable.id],
//     }),
//     orderItems: many(orderItemsTable)
// }))

// export const orderItemsRelation = relations(orderItemsTable, ({one}) => ({
//     order: one(ordersTable, {
//         fields: [orderItemsTable.orderId],
//         references: [ordersTable.id]
//     }),
//     product: one(productsTable, {
//         fields: [orderItemsTable.productId],
//         references: [productsTable.id],
//     })
// }))



import { relations, sql } from "drizzle-orm";
import { pgTable, serial, float, integer, varchar, text, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";

// ---------- USERS ----------
export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  avatarUrl: text("avatar_url"),
  isEmailValid: boolean("is_email_valid").default(false).notNull(),
  isBlocked: boolean("is_blocked").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ---------- PRODUCTS ----------
export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  price: integer("price").notNull(),
  originalPrice: integer("original_price").notNull(),
  ratings: float("ratings").notNull(),
  image: text("image"),
  isAvailable: boolean("is_available").default(true).notNull(),
});

// ---------- CART ITEMS ----------
export const cartItemsTable = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").notNull().references(() => productsTable.id),
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
});

// ---------- SESSIONS ----------
export const sessionsTable = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  valid: boolean("valid").default(true).notNull(),
  userAgent: text("user_agent"),
  ip: varchar("ip", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ---------- ORDERS ----------
export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  street: varchar("street", { length: 255 }).notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  state: varchar("state", { length: 255 }).notNull(),
  zipCode: integer("zip_code").notNull(),
  country: varchar("country", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 255 }).notNull(),
  status: varchar("status", { length: 255 }).notNull(),
  payment: boolean("payment").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ---------- ORDER ITEMS ----------
export const orderItemsTable = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => ordersTable.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull().references(() => productsTable.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
});

// ---------- CONTACTS ----------
export const contactsTable = pgTable("contacts", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: varchar("message", { length: 255 }).notNull(),
});

export const verifyEmailTokenTable = pgTable("verify_email_token", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  token: varchar("token", { length: 8 }).notNull(),
  expiresAt: timestamp("expires_at").default(sql`CURRENT_TIMESTAMP + INTERVAL '1 day'`).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const resetPasswordTokenTable = pgTable("reset_password_token", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique().references(() => usersTable.id, { onDelete: 'cascade' }),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at").default(sql`CURRENT_TIMESTAMP + INTERVAL '1 hour'`).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- OAUTH ACCOUNTS ----------
export const providerEnum = pgEnum("provider", ["google", "github"]);

export const oauthAccountsTable = pgTable("oauth_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  provider: providerEnum().notNull(),
  providerAccountId: varchar("provider_account_id", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- RELATIONS ----------
export const usersRelation = relations(usersTable, ({ many }) => ({
  cartItems: many(cartItemsTable),
  sessions: many(sessionsTable),
}));

export const productsRelation = relations(productsTable, ({ many }) => ({
  cartItems: many(cartItemsTable),
}));

export const cartItemsRelation = relations(cartItemsTable, ({ one }) => ({
  users: one(usersTable, { fields: [cartItemsTable.userId], references: [usersTable.id] }),
  products: one(productsTable, { fields: [cartItemsTable.itemId], references: [productsTable.id] }),
}));

export const sessionsRelation = relations(sessionsTable, ({ one }) => ({
  users: one(usersTable, { fields: [sessionsTable.userId], references: [usersTable.id] }),
}));

export const ordersRelation = relations(ordersTable, ({ many, one }) => ({
  user: one(usersTable, { fields: [ordersTable.userId], references: [usersTable.id] }),
  orderItems: many(orderItemsTable),
}));

export const orderItemsRelation = relations(orderItemsTable, ({ one }) => ({
  order: one(ordersTable, { fields: [orderItemsTable.orderId], references: [ordersTable.id] }),
  product: one(productsTable, { fields: [orderItemsTable.productId], references: [productsTable.id] }),
}));
