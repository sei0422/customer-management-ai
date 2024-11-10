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

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Create test user function
async function createTestUser() {
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
}

(async () => {
  // Create test user
  await createTestUser();
  
  registerRoutes(app);
  const server = createServer(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const PORT = 5000;
  server.listen(PORT, "0.0.0.0", () => {
    const formattedTime = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    console.log(`${formattedTime} [express] serving on port ${PORT}`);
  });
})();
