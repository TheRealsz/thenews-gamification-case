import { Hono } from "hono";
import { Env } from "..";
import { drizzle } from "drizzle-orm/d1";
import { usersStreakTable, usersTable, webhookUserReadedNewslettersTable } from "../db/schema";
import { asc, desc, eq, sql } from "drizzle-orm";
import { formatDateWithoutHours } from "../utils/formatDate";

const userApi = new Hono<{ Bindings: Env }>();

userApi
    .get('/user', async (c) => {
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
    })
    .get("/users/ranking", async (c) => {
        try {
            const orderBy = c.req.query('orderBy') || "best_streak";
            const orderDir = c.req.query('order') || "desc";
            const dateFrom = c.req.query('dateFrom');
            const dateTo = c.req.query('dateTo');
            const page = parseInt(c.req.query('page') || "1", 10);
            const limit = parseInt(c.req.query('limit') || "10", 10);
            const offset = (page - 1) * limit;

            const db = drizzle(c.env.DB);

            let orderClause;

            if (orderBy === "total_days_readed") {
                orderClause = orderDir === "asc" ? asc(usersStreakTable.total_days_readed) : desc(usersStreakTable.total_days_readed);
            } else if (orderBy === "streak") {
                orderClause = orderDir === "asc" ? asc(usersStreakTable.streak) : desc(usersStreakTable.streak);
            } else {
                orderClause = orderDir === "asc" ? asc(usersStreakTable.best_streak) : desc(usersStreakTable.best_streak);
            }

            let usersRanking;

            if (dateFrom && dateTo) {
                usersRanking = await db.select({
                    id: usersTable.id,
                    email: usersTable.email,
                    streak: usersStreakTable.streak,
                    best_streak: usersStreakTable.best_streak,
                    total_days_readed: usersStreakTable.total_days_readed,
                })
                    .from(usersTable)
                    .innerJoin(usersStreakTable, eq(usersTable.id, usersStreakTable.user_id))
                    .where(sql`${usersStreakTable.created_at} BETWEEN ${dateFrom} AND ${dateTo}`)
                    .orderBy(orderClause)
                    .limit(limit)
                    .offset(offset)
                    .all();
            } else {
                usersRanking = await db.select({
                    id: usersTable.id,
                    email: usersTable.email,
                    streak: usersStreakTable.streak,
                    best_streak: usersStreakTable.best_streak,
                    total_days_readed: usersStreakTable.total_days_readed,
                })
                    .from(usersTable)
                    .innerJoin(usersStreakTable, eq(usersTable.id, usersStreakTable.user_id))
                    .orderBy(orderClause)
                    .limit(limit)
                    .offset(offset)
                    .all();
            }

            return c.json({ data: usersRanking, page, limit });

        } catch (error) {
            console.error(error)
            return c.json({ message: "Internal server error" }, 500);
        }
    })


export default userApi