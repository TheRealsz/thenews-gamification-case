import { Hono } from "hono";
import { Env } from "..";
import { drizzle } from "drizzle-orm/d1";
import { usersStreakTable, usersTable, webhookUserReadedNewslettersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { formatDateWithoutHours } from "../utils/formatDate";

const userApi = new Hono<{ Bindings: Env }>();

userApi
    .get('/', async (c) => {
        const db = drizzle(c.env.DB);
        const email = c.req.query('email');
        if (!email) {
            return c.json({ message: "Email is required" }, 400);
        }

        const findUserRegister = await db.select().from(usersTable).where(eq(usersTable.email, email)).get();
        if (!findUserRegister) {
            return c.json({ message: "User not found" }, 404);
        }

        const userStreak = await db.select().from(usersStreakTable).where(eq(usersStreakTable.id, findUserRegister.id)).get();
        if (!userStreak) {
            return c.json({ message: "User streak not found" }, 404);
        }

        const allUserReadedNewsletterData = await db.select().from(webhookUserReadedNewslettersTable).where(eq(webhookUserReadedNewslettersTable.email, email)).all();
        const getAllUserReadedNewsletterData = allUserReadedNewsletterData.map((data) => {
            return {
                newsletter_id: data.id,
                day_readed: formatDateWithoutHours(data.created_at || new Date().toISOString()),
            }
        }
        );

        return c.json({
            user: {
                id: findUserRegister.id,
                email: findUserRegister.email,
                streak: userStreak.streak,
                best_streak: userStreak.best_streak,
            },
            newsletters: getAllUserReadedNewsletterData
        });
    });

export default userApi