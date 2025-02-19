import { Hono } from "hono";
import { Env } from "..";
import { drizzle } from "drizzle-orm/d1";
import { usersStreakTable, usersTable, webhookUserReadedNewslettersTable } from "../db/schema";
import { asc, eq } from "drizzle-orm";
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

        const allUserReadedNewsletterData = await db
            .select()
            .from(webhookUserReadedNewslettersTable)
            .where(eq(webhookUserReadedNewslettersTable.email, email))
            .orderBy(asc(webhookUserReadedNewslettersTable.created_at))
            .all();

        const getAllUserReadedNewsletterData = allUserReadedNewsletterData.map((data) => {
            if (!data.created_at) return
            return {
                newsletter_id: data.id,
                day_readed: formatDateWithoutHours(data.created_at),
            }
        }
        );

        const firstDayUserReaded = allUserReadedNewsletterData[0];
        const today = formatDateWithoutHours(new Date().toISOString());
        const allDaysBetweenFirstDayAndTodayWithoutSunday = allUserReadedNewsletterData.filter((data) => {
            if (!data.created_at) return
            const dayReaded = formatDateWithoutHours(data.created_at);
            return new Date(dayReaded).getDay() !== 0;
        });

        const allValidDaysReaded = [firstDayUserReaded, ...allDaysBetweenFirstDayAndTodayWithoutSunday];
        const percentageOfDaysReaded = (userStreak.total_days_readed / allValidDaysReaded.length) * 100;

        const filterTotalDaysReadedOnCurrentMonth = allValidDaysReaded.filter((data) => {
            if (!data.created_at) return
            const dayReaded = formatDateWithoutHours(data.created_at);
            return new Date(dayReaded).getMonth() === new Date(today).getMonth();
        });

        const totalDaysReadedOnCurrentMonth = filterTotalDaysReadedOnCurrentMonth.length

        return c.json({
            user: {
                id: findUserRegister.id,
                email: findUserRegister.email,
                streak: userStreak.streak,
                best_streak: userStreak.best_streak,
                total_days_readed: userStreak.total_days_readed,
                percentage_of_days_readed: percentageOfDaysReaded,
                total_days_readed_on_current_month: totalDaysReadedOnCurrentMonth,
            },
            newsletters: getAllUserReadedNewsletterData
        });
    });

export default userApi