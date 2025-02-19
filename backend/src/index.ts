import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { usersStreakTable, usersTable, webhookUserReadedNewslettersTable } from './db/schema';
import { desc, eq, is, sql } from 'drizzle-orm';
import { formatDateWithoutHours } from './utils/formatDate';

export interface Env {
  DB: D1Database
}

const api = new Hono<{ Bindings: Env }>();

api
  .get('/', async (c) => {
    try {
      const db = drizzle(c.env.DB);

      const email = c.req.query('email');
      if (!email) {
        return c.json({ message: "Email is required" }, 400);
      }

      const id = c.req.query('id');
      if (!id) {
        return c.json({ message: "Id is required" }, 400);
      }

      const utm_source = c.req.query('utm_source');
      const utm_medium = c.req.query('utm_medium');
      const utm_campaign = c.req.query('utm_campaign');
      const utm_channel = c.req.query('utm_channel');

      const findUserRegister = await db.select().from(usersTable).where(eq(usersTable.email, email)).all();
      const isUserRegistered = findUserRegister.length > 0;
      if (!isUserRegistered) {
        const createUser = await db.insert(usersTable).values({
          email: email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }).returning();

        await db.insert(usersStreakTable).values({
          user_id: createUser[0].id,
          streak: 1,
          best_streak: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

        await db.insert(webhookUserReadedNewslettersTable).values({
          id: id,
          email: email,
          utm_source: utm_source,
          utm_medium: utm_medium,
          utm_campaign: utm_campaign,
          utm_channel: utm_channel,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

        return c.json({ message: "Saved Event" }, 201);
      }

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      let validStreakDay = yesterday
      const isYesterdaySunday = yesterday.getDay() === 0;

      if (isYesterdaySunday) {
        validStreakDay = new Date(yesterday);
        validStreakDay.setDate(yesterday.getDate() - 1);
      }

      const validStreakDayWithoutHours = formatDateWithoutHours(validStreakDay);

      const fiundUserThatReadedNewsletterInAValidDay = await db.select()
        .from(webhookUserReadedNewslettersTable)
        .where(sql`${webhookUserReadedNewslettersTable.email} = ${email} AND substr(${webhookUserReadedNewslettersTable.created_at},1,10) = ${validStreakDayWithoutHours}`)
        .all();

      const hasUserReadeadNewsletterInAValidaDay = fiundUserThatReadedNewsletterInAValidDay.length > 0;

      if (!hasUserReadeadNewsletterInAValidaDay) {
        await db.update(usersStreakTable).set({
          streak: 1,
          updated_at: new Date().toISOString()
        }).where(eq(usersStreakTable.user_id, findUserRegister[0].id)).run();

        await db.insert(webhookUserReadedNewslettersTable).values({
          id: id,
          email: email,
          utm_source: utm_source,
          utm_medium: utm_medium,
          utm_campaign: utm_campaign,
          utm_channel: utm_channel,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        return c.json({ message: "Saved Event" }, 201);
      } else {

        const findUserStreak = await db.select().from(usersStreakTable).where(eq(usersStreakTable.user_id, findUserRegister[0].id)).all();
        const newStreak = findUserStreak[0].streak + 1;
        const bestStreak = newStreak > findUserStreak[0].best_streak ? newStreak : findUserStreak[0].best_streak;

        await db.update(usersStreakTable).set({
          streak: newStreak,
          best_streak: bestStreak,
          updated_at: new Date().toISOString()
        }).where(eq(usersStreakTable.user_id, findUserRegister[0].id)).run();

        await db.insert(webhookUserReadedNewslettersTable).values({
          id: id,
          email: email,
          utm_source: utm_source,
          utm_medium: utm_medium,
          utm_campaign: utm_campaign,
          utm_channel: utm_channel,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        return c.json({ message: "Saved Event" }, 201);
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
      return c.json({ message: "Internal Server Error" }, 500);
    }
  });

const app = new Hono();
app.route('/', api);


export default app
