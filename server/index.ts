import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";
import { createServer } from "http";
import session from "express-session";
import passport from "./auth";
import bcrypt from "bcrypt";
import { db } from "./db";
import { users } from "db/schema";
import { eq } from "drizzle-orm";
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { join } from 'path';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add request logging
app.use((req, res, next) => {
  const formattedTime = new Date().toLocaleTimeString();
  console.log(`[${formattedTime}] ${req.method} ${req.path}`);
  next();
});

// Session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Create test user function
async function createTestUser() {
  try {
    const existingUser = await db.select().from(users).where(eq(users.username, "test")).limit(1);
    if (existingUser.length === 0) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      await db.insert(users).values({
        username: "test",
        password: hashedPassword,
        name: "Test User",
        email: "test@example.com"
      });
      console.log("Test user created successfully");
    }
  } catch (error) {
    console.error("Error creating test user:", error);
  }
}

(async () => {
  try {
    // Run migrations
    console.log('Starting database migrations...');
    const migrationsFolder = join(process.cwd(), 'migrations');
    console.log('Migration folder:', migrationsFolder);
    
    await migrate(db, { 
      migrationsFolder: join(process.cwd(), 'migrations'),
      migrationsTable: 'drizzle_migrations'
    });
    console.log('Database migrations completed');
    
    // Create test user
    await createTestUser();
    
    registerRoutes(app);
    const server = createServer(app);

    // Error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error('Error:', err);
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });

    if (process.env.NODE_ENV !== "production") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    const port = process.env.PORT || 5000;
    server.listen(port, "0.0.0.0", () => {
      const formattedTime = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      console.log(`${formattedTime} [express] serving on port ${port}`);
    });
  } catch (error) {
    console.error('Startup error:', error);
    process.exit(1);
  }
})();
