import type { Express } from "express";
import { db } from "../db";
import { accounts, contacts, opportunities, users } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import passport from "passport";

export function registerRoutes(app: Express) {
  // Auth routes
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json({ success: true });
  });

  app.post("/api/logout", (req, res) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });

  // Account routes
  app.get("/api/accounts", async (req, res) => {
    const results = await db.select().from(accounts);
    res.json(results);
  });

  app.post("/api/accounts", async (req, res) => {
    const account = await db.insert(accounts).values(req.body).returning();
    res.json(account[0]);
  });

  app.put("/api/accounts/:id", async (req, res) => {
    const account = await db
      .update(accounts)
      .set(req.body)
      .where(eq(accounts.id, parseInt(req.params.id)))
      .returning();
    res.json(account[0]);
  });

  app.delete("/api/accounts/:id", async (req, res) => {
    await db.delete(accounts).where(eq(accounts.id, parseInt(req.params.id)));
    res.json({ success: true });
  });

  // Contact routes
  app.get("/api/contacts", async (req, res) => {
    const results = await db.select().from(contacts);
    res.json(results);
  });

  app.post("/api/contacts", async (req, res) => {
    const contact = await db.insert(contacts).values(req.body).returning();
    res.json(contact[0]);
  });

  app.put("/api/contacts/:id", async (req, res) => {
    const contact = await db
      .update(contacts)
      .set(req.body)
      .where(eq(contacts.id, parseInt(req.params.id)))
      .returning();
    res.json(contact[0]);
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    await db.delete(contacts).where(eq(contacts.id, parseInt(req.params.id)));
    res.json({ success: true });
  });

  // Opportunity routes
  app.get("/api/opportunities", async (req, res) => {
    const results = await db.select().from(opportunities);
    res.json(results);
  });

  app.post("/api/opportunities", async (req, res) => {
    const opportunity = await db.insert(opportunities).values(req.body).returning();
    res.json(opportunity[0]);
  });

  app.put("/api/opportunities/:id", async (req, res) => {
    const opportunity = await db
      .update(opportunities)
      .set(req.body)
      .where(eq(opportunities.id, parseInt(req.params.id)))
      .returning();
    res.json(opportunity[0]);
  });

  app.delete("/api/opportunities/:id", async (req, res) => {
    await db.delete(opportunities).where(eq(opportunities.id, parseInt(req.params.id)));
    res.json({ success: true });
  });

  // Dashboard metrics
  app.get("/api/metrics", async (req, res) => {
    const [accountCount, contactCount, opportunityCount] = await Promise.all([
      db.select().from(accounts).execute(),
      db.select().from(contacts).execute(),
      db.select().from(opportunities).execute(),
    ]);

    res.json({
      accounts: accountCount.length,
      contacts: contactCount.length,
      opportunities: opportunityCount.length,
      totalValue: opportunityCount.reduce((sum, opp) => sum + (opp.amount || 0), 0),
    });
  });
}
