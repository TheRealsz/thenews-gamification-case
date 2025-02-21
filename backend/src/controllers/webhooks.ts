import { Hono } from "hono";
import { drizzle } from 'drizzle-orm/d1';
import { newslettersTable, usersStreakTable, usersTable, webhookUserReadedNewslettersTable } from '../db/schema';
import { eq, sql } from 'drizzle-orm';
import { Env } from "..";
import { formatDateWithoutHours } from "../utils/formatDate";

const webhookApi = new Hono<{ Bindings: Env }>();

webhookApi
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

            const isNewsletterRegistered = await db.select().from(newslettersTable).where(eq(newslettersTable.id, id)).get();

            if (!isNewsletterRegistered) {
                await db.insert(newslettersTable).values({
                    id: id,
                    total_opened: 1,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
            } else {
                await db.update(newslettersTable).set({
                    total_opened: isNewsletterRegistered.total_opened + 1,
                    updated_at: new Date().toISOString()
                }).where(eq(newslettersTable.id, id)).run();
            }

            const today = new Date();

            if (today.getDay() === 0) {
                return c.json({ message: "Today is Sunday" }, 400);
            }

            const findUserReadedNewsletterToday = await db.select()
                .from(webhookUserReadedNewslettersTable)
                .where(sql`${webhookUserReadedNewslettersTable.email} = ${email} AND substr(${webhookUserReadedNewslettersTable.created_at},1,10) = ${formatDateWithoutHours(today)}`)
                .get()

            if (findUserReadedNewsletterToday) {
                return c.json({ message: "User already readed newsletter today" }, 400);
            }


            const utm_source = c.req.query('utm_source');
            const utm_medium = c.req.query('utm_medium');
            const utm_campaign = c.req.query('utm_campaign');
            const utm_channel = c.req.query('utm_channel');

            const isUserRegistered = await db.select().from(usersTable).where(eq(usersTable.email, email)).get();
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
                    total_days_readed: 1,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });

                await db.insert(webhookUserReadedNewslettersTable).values({
                    id_post: id,
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

            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);

            let validStreakDay = yesterday
            const isYesterdaySunday = yesterday.getDay() === 0;

            if (isYesterdaySunday) {
                validStreakDay = new Date(yesterday);
                validStreakDay.setDate(yesterday.getDate() - 1);
            }

            const validStreakDayWithoutHours = formatDateWithoutHours(validStreakDay);

            const hasUserReadeadNewsletterInAValidaDay = await db.select()
                .from(webhookUserReadedNewslettersTable)
                .where(sql`${webhookUserReadedNewslettersTable.email} = ${email} AND substr(${webhookUserReadedNewslettersTable.created_at},1,10) = ${validStreakDayWithoutHours}`)
                .get()


            const userStreakInformations = await db.select().from(usersStreakTable).where(eq(usersStreakTable.user_id, isUserRegistered.id)).get();

            if (!userStreakInformations) {
                return c.json({ message: "User not found" }, 404);
            }

            if (!hasUserReadeadNewsletterInAValidaDay) {
                await db.update(usersStreakTable).set({
                    streak: 1,
                    total_days_readed: userStreakInformations.total_days_readed + 1,
                    updated_at: new Date().toISOString()
                }).where(eq(usersStreakTable.user_id, isUserRegistered.id)).run();

                await db.insert(webhookUserReadedNewslettersTable).values({
                    id_post: id,
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

                const newStreak = userStreakInformations.streak + 1;
                const bestStreak = newStreak > userStreakInformations.best_streak ? newStreak : userStreakInformations.best_streak;

                await db.update(usersStreakTable).set({
                    streak: newStreak,
                    best_streak: bestStreak,
                    total_days_readed: userStreakInformations.total_days_readed + 1,
                    updated_at: new Date().toISOString()
                }).where(eq(usersStreakTable.user_id, isUserRegistered.id)).run();

                await db.insert(webhookUserReadedNewslettersTable).values({
                    id_post: id,
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

export default webhookApi;