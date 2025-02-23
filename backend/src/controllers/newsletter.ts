import { Hono } from "hono";
import { drizzle } from 'drizzle-orm/d1';
import { webhookUserReadedNewslettersTable } from '../db/schema';
import { sql } from 'drizzle-orm';
import { Env } from "..";

const newsletterApi = new Hono<{ Bindings: Env }>();

newsletterApi
    .get('/newsletters', async (c) => {
        try {
            const db = drizzle(c.env.DB);

            const period = c.req.query('period') ?? "week"

            let result;
            const today = new Date();
            if (period === "week") {
                const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
                result = await db
                    .select({
                        date: sql`DATE(${webhookUserReadedNewslettersTable.created_at})`.as("date"),
                        total: sql`COUNT(DISTINCT ${webhookUserReadedNewslettersTable.email})`.as("total"),
                    })
                    .from(webhookUserReadedNewslettersTable)
                    .where(sql`${webhookUserReadedNewslettersTable.created_at} >= ${lastWeek.toISOString()}`)
                    .groupBy(sql`DATE(${webhookUserReadedNewslettersTable.created_at})`)
                    .orderBy(sql`DATE(${webhookUserReadedNewslettersTable.created_at}) ASC`)
                    .all();
            } else if (period === "month") {
                const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
                result = await db
                    .select({
                        date: sql`strftime('%Y-%m', ${webhookUserReadedNewslettersTable.created_at})`.as("date"),
                        total: sql`COUNT(*)`.as("total"),
                    })
                    .from(webhookUserReadedNewslettersTable)
                    .where(sql`${webhookUserReadedNewslettersTable.created_at} >= ${lastYear.toISOString()}`)
                    .groupBy(sql`strftime('%Y-%m', ${webhookUserReadedNewslettersTable.created_at})`)
                    .orderBy(sql`strftime('%Y-%m', ${webhookUserReadedNewslettersTable.created_at}) ASC`)
                    .all();
            } else if (period === "day") {
                const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
                result = await db
                    .select({
                        date: sql`strftime('%H', ${webhookUserReadedNewslettersTable.created_at})`.as("date"),
                        total: sql`COUNT(*)`.as("total"),
                    })
                    .from(webhookUserReadedNewslettersTable)
                    .where(sql`${webhookUserReadedNewslettersTable.created_at} >= ${yesterday.toISOString()}`)
                    .groupBy(sql`strftime('%H', ${webhookUserReadedNewslettersTable.created_at})`)
                    .orderBy(sql`strftime('%H', ${webhookUserReadedNewslettersTable.created_at}) ASC`)
                    .all();
            } else {
                return c.json({ message: "Parametro de periodo invalido" }, 400);
            }

            return c.json(result, 200);
        } catch (error) {
            console.error("Error processing newsletters:", error);
            return c.json({ message: "Aconteceu um erro inesperado, tente novamente mais tarde" }, 500);
        }
    });

export default newsletterApi;