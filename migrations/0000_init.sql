CREATE TABLE IF NOT EXISTS "users" (
    "id" serial PRIMARY KEY NOT NULL,
    "username" text NOT NULL,
    "password" text NOT NULL,
    "name" text NOT NULL,
    "email" text NOT NULL,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now(),
    CONSTRAINT "users_username_unique" UNIQUE("username")
);

CREATE TABLE IF NOT EXISTS "accounts" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" text NOT NULL,
    "type" text NOT NULL,
    "industry" text,
    "phone" text,
    "website" text,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "contacts" (
    "id" serial PRIMARY KEY NOT NULL,
    "account_id" integer REFERENCES "accounts"("id"),
    "first_name" text NOT NULL,
    "last_name" text NOT NULL,
    "email" text,
    "phone" text,
    "title" text,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "opportunities" (
    "id" serial PRIMARY KEY NOT NULL,
    "account_id" integer REFERENCES "accounts"("id"),
    "name" text NOT NULL,
    "stage" text NOT NULL,
    "amount" integer,
    "close_date" timestamp,
    "probability" integer,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);
