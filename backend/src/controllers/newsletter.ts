import { Hono } from "hono";
import { drizzle } from 'drizzle-orm/d1';
import { webhookUserReadedNewslettersTable } from '../db/schema';
import { sql } from 'drizzle-orm';
import { Env } from "..";

interface IChart {
    label: string;
    total: number;
}

interface IMonthData {
    month: string;
    total: number;
}

interface IDayData {
    period: string;
    total: number;
}

const newsletterApi = new Hono<{ Bindings: Env }>();

newsletterApi
    .get('/newsletters', async (c) => {
        try {
            const db = drizzle(c.env.DB);
            const today = new Date();
            const todayUTC = new Date(today.toISOString());

            const weekStart = new Date(todayUTC);
            weekStart.setUTCDate(todayUTC.getUTCDate() - 7);
            const weekRaw = await db
                .select({
                    day: sql`strftime('%w', ${webhookUserReadedNewslettersTable.created_at})`.as("day"),
                    total: sql`COUNT(DISTINCT ${webhookUserReadedNewslettersTable.email})`.as("total"),
                })
                .from(webhookUserReadedNewslettersTable)
                .where(sql`${webhookUserReadedNewslettersTable.created_at} >= ${weekStart.toISOString()}`)
                .groupBy(sql`strftime('%w', ${webhookUserReadedNewslettersTable.created_at})`)
                .orderBy(sql`strftime('%w', ${webhookUserReadedNewslettersTable.created_at}) ASC`)
                .all();

            const weekDays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
            const completeWeekData: IChart[] = weekDays.map((dayName, index) => {
                const found = weekRaw.find((item) => parseInt(item.day as string, 10) === index);
                return { label: dayName, total: found ? Number(found.total) : 0 };
            });

            const lastYear = new Date(todayUTC);
            lastYear.setUTCFullYear(todayUTC.getUTCFullYear() - 1);
            const monthRaw = await db
                .select({
                    month: sql`strftime('%m', ${webhookUserReadedNewslettersTable.created_at})`.as("month"),
                    total: sql`COUNT(*)`.as("total"),
                })
                .from(webhookUserReadedNewslettersTable)
                .where(sql`${webhookUserReadedNewslettersTable.created_at} >= ${lastYear.toISOString()}`)
                .groupBy(sql`strftime('%m', ${webhookUserReadedNewslettersTable.created_at})`)
                .orderBy(sql`strftime('%m', ${webhookUserReadedNewslettersTable.created_at}) ASC`)
                .all();

            const allMonths = [
                { month: "Janeiro", total: 0 },
                { month: "Fevereiro", total: 0 },
                { month: "Março", total: 0 },
                { month: "Abril", total: 0 },
                { month: "Maio", total: 0 },
                { month: "Junho", total: 0 },
                { month: "Julho", total: 0 },
                { month: "Agosto", total: 0 },
                { month: "Setembro", total: 0 },
                { month: "Outubro", total: 0 },
                { month: "Novembro", total: 0 },
                { month: "Dezembro", total: 0 },
            ];


            const completeMonthData: IChart[] = allMonths.map((m, index) => {
                const monthStr = (index + 1).toString().padStart(2, "0");
                const found = monthRaw.find((item) => item.month === monthStr);
                return { label: m.month, total: found ? Number(found.total) : 0 };
            });

            const yesterday = new Date(todayUTC.getTime() - 24 * 60 * 60 * 1000);
            const dayRaw = await db
                .select({
                    hour: sql`CAST(strftime('%H', ${webhookUserReadedNewslettersTable.created_at}) AS INTEGER)`.as("hour"),
                    total: sql`COUNT(*)`.as("total"),
                })
                .from(webhookUserReadedNewslettersTable)
                .where(sql`${webhookUserReadedNewslettersTable.created_at} >= ${yesterday.toISOString()}`)
                .groupBy(sql`strftime('%H', ${webhookUserReadedNewslettersTable.created_at})`)
                .orderBy(sql`strftime('%H', ${webhookUserReadedNewslettersTable.created_at}) ASC`)
                .all();

            const timeBlocks = [
                { label: "00h - 06h", min: 0, max: 6 },
                { label: "06h - 12h", min: 6, max: 12 },
                { label: "12h - 18h", min: 12, max: 18 },
                { label: "18h - 00h", min: 18, max: 24 },
            ];
            const completeDayData: IChart[] = timeBlocks.map((block) => ({
                label: block.label,
                total: dayRaw
                    .filter((item) => Number(item.hour) >= block.min && Number(item.hour) < block.max)
                    .reduce((acc, item) => acc + Number(item.total), 0),
            }));

            return c.json({ week: completeWeekData, month: completeMonthData, day: completeDayData }, 200);
        } catch (error) {
            console.error("Erro ao processar dados para gráficos:", error);
            return c.json({ message: "Aconteceu um erro inesperado, tente novamente mais tarde" }, 500);
        }
    });

export default newsletterApi;