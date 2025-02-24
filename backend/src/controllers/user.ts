import { Hono } from "hono";
import { Env } from "..";
import { drizzle } from "drizzle-orm/d1";
import { usersStreakTable, usersTable, webhookUserReadedNewslettersTable } from "../db/schema";
import { asc, desc, eq, sql } from "drizzle-orm";
import { formatDateUTC } from "../utils/formatDate";
import { getMotivationalMessageAndEmoji } from "../utils/motivationalMessagesAndEmoji";

const userApi = new Hono<{ Bindings: Env }>();

userApi
    .get('/user', async (c) => {
        try {
            const db = drizzle(c.env.DB);
            const email = c.req.query('email');
            if (!email) {
                return c.json({ message: "Email é obrigatório" }, 400);
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return c.json({ message: "O email informado é inválido" }, 400);
            }

            const findUserRegister = await db.select().from(usersTable).where(eq(usersTable.email, email)).get();
            if (!findUserRegister) {
                return c.json({ message: "Usuario não encontrado" }, 404);
            }

            const today = new Date();
            let validStreakDay = new Date(today);
            validStreakDay.setUTCDate(today.getUTCDate() - 1);

            if (validStreakDay.getUTCDay() === 0) {
                validStreakDay.setUTCDate(validStreakDay.getUTCDate() - 1);
            }

            const validStreakDayString = formatDateUTC(validStreakDay);

            const hasUserReadNewsletter = await db.select()
                .from(webhookUserReadedNewslettersTable)
                .where(sql`${webhookUserReadedNewslettersTable.email} = ${email} AND substr(${webhookUserReadedNewslettersTable.created_at}, 1, 10) = ${validStreakDayString}`)
                .get();


            const userStreakInformations = await db.select().from(usersStreakTable).where(eq(usersStreakTable.user_id, findUserRegister.id)).get();

            if (!userStreakInformations) {
                return c.json({ message: "Usuario não encontrado" }, 404);
            }

            if (!hasUserReadNewsletter) {
                await db.update(usersStreakTable).set({
                    streak: 0,
                    updated_at: new Date().toISOString()
                }).where(eq(usersStreakTable.user_id, findUserRegister.id)).run();
            }

            const updatedStreak = await db.select().from(usersStreakTable).where(eq(usersStreakTable.user_id, findUserRegister.id)).get();

            if (!updatedStreak) {
                return c.json({ message: "Usuario não encontrado" }, 404);
            }

            const allUserReadedNewsletterData = await db
                .select()
                .from(webhookUserReadedNewslettersTable)
                .where(eq(webhookUserReadedNewslettersTable.email, email))
                .orderBy(asc(webhookUserReadedNewslettersTable.created_at))
                .all();

            const daysReaded = allUserReadedNewsletterData.map(data => {
                if (!data.created_at) return
                return formatDateUTC(data.created_at)
            });
            const firstDayReaded = allUserReadedNewsletterData[0]?.created_at;
            if (!firstDayReaded) {
                return c.json({ message: "Nenhum dia de leitura encontrado" }, 404);
            }

            const firstDayDate = new Date(firstDayReaded);
            firstDayDate.setUTCHours(0, 0, 0, 0);

            let validDaysCount = 0;
            let currentDate = new Date(firstDayDate);
            today.setUTCHours(0, 0, 0, 0);
            while (currentDate <= today) {
                if (currentDate.getUTCDay() !== 0) {
                    validDaysCount++;
                }
                currentDate.setUTCDate(currentDate.getUTCDate() + 1);
            }

            const percentageOfDaysReaded = (daysReaded.length / validDaysCount) * 100;

            const todayString = formatDateUTC(today);
            const daysReadedThisMonth = daysReaded.filter(data => {
                if (!data) return
                return new Date(data).getUTCMonth() === new Date(todayString).getUTCMonth();
            }).length;

            const motivationalMessageAndEmoji = getMotivationalMessageAndEmoji(updatedStreak.streak);

            return c.json({
                id: findUserRegister.id,
                email: findUserRegister.email,
                motivational_message: motivationalMessageAndEmoji.message,
                emoji: motivationalMessageAndEmoji.emoji,
                streak: updatedStreak.streak,
                best_streak: updatedStreak.best_streak,
                total_days_readed: updatedStreak.total_days_readed,
                percentage_of_days_readed: percentageOfDaysReaded.toFixed(2),
                total_days_readed_on_current_month: daysReadedThisMonth,
                days_readed: daysReaded
            }, 200);
        } catch (error) {
            console.error("Error processing user:", error);
            return c.json({ message: "Aconteceu um erro inesperado, tente novamente mais tarde" }, 500);
        }
    })
    .get("/users/ranking", async (c) => {
        try {
            const orderBy = c.req.query('orderBy') ?? "best_streak";
            const orderDir = c.req.query('order') ?? "desc";
            const page = parseInt(c.req.query('page') ?? "1", 10);
            const limit = 10
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

            const totalRecords = await db.select({ count: sql<number>`COUNT(*)` }).from(usersStreakTable).get();
            if (!totalRecords) {
                return c.json({ message: "Erro ao obter o total de registros" }, 500);
            }

            const totalPages = Math.ceil(totalRecords.count / limit);

            const usersRanking = await db.select({
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

            return c.json({
                usersRanking: usersRanking,
                page,
                limit,
                totalPages
            }, 200);

        } catch (error) {
            console.error(error);
            return c.json({ message: "Aconteceu um erro inesperado, tente novamente mais tarde" }, 500);
        }
    })


export default userApi