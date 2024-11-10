import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.select().from(users).where(eq(users.username, username)).limit(1);
      if (!user.length) {
        return done(null, false, { message: "ユーザーが見つかりません" });
      }

      const match = await bcrypt.compare(password, user[0].password);
      if (!match) {
        return done(null, false, { message: "パスワードが間違っています" });
      }

      return done(null, user[0]);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
    done(null, user[0]);
  } catch (err) {
    done(err);
  }
});

export default passport;
