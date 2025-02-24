import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import { DynamicChart } from "@/components/ui/dynamic-chart";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/service/api";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface IChartData {
    label: string
    total: number
}

const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
]
const chartConfig = {
    type: "bar",
    xKey: "month",
    yKeys: ["desktop"],
    colors: ["var(--color-supernova-400)"],
    tooltip: {
        cursor: false,
        content: {
            hideLabel: true
        }
    }
} as ChartConfig

export function NewslettersInformation() {
    const [monthChartData, setMonthChartData] = useState<IChartData[]>([] as IChartData[])
    const [weekChartData, setWeekChartData] = useState<IChartData[]>([] as IChartData[])
    const [dayChartData, setDayChartData] = useState<IChartData[]>([] as IChartData[])
    const [loading, setLoading] = useState(false)

    async function getChartData() {
        setLoading(true)
        try {
            const response = await api.get("/newsletters")
            setMonthChartData(response.data.month)
            setWeekChartData(response.data.week)
            setDayChartData(response.data.day)
        } catch (e) {
            if (axios.isAxiosError(e)) {
                console.error("Axios error:", e.response?.data || e.message);
                toast.error(e.response?.data?.message || "Aconteceu um erro inesperado, tente novamente mais tarde");
            } else {
                console.error("Unexpected error:", e);
                toast.error("Aconteceu um erro inesperado, tente novamente mais tarde");
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getChartData()
    }, [])

    return (
        <Card className="rounded-xl py-4 w-full">
            <div className="w-full rounded-[10px] flex flex-col gap-4">
                <CardHeader>
                    <div className="mb-4 flex flex-col gap-2">
                        <CardTitle className="text-xl text-zinc-900 md:text-2xl">Estatísticas de newsletters</CardTitle>
                        <CardDescription className="md:text-lg text-base">
                            Acompanhe as estatísticas das newsletters cadastrados no sistema
                        </CardDescription>
                    </div>
                </CardHeader>
                {
                    loading ? (
                        <div className="grid grid-cols-12 gap-y-5 xl:gap-y-10">
                            <Skeleton className="mx-4 h-72 col-span-12 xl:col-span-6" />
                            <Skeleton className="mx-4 h-72 col-span-12 xl:col-span-6" />
                            <Skeleton className="mx-4 h-72 col-span-12 xl:col-span-6" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-12 w-full gap-y-5 xl:gap-y-10">
                            <DynamicChart
                                title="Newsletters abertos por mês"
                                description="Acompanhe a quantidade de newsletters abertos por mês"
                                chartData={monthChartData}
                                chartConfig={chartConfig}
                            />
                            <DynamicChart
                                title="Newsletters abertos na ultima semana"
                                description="Acompanhe a quantidade de newsletters abertos na ultima semana"
                                chartData={weekChartData}
                                chartConfig={chartConfig}
                            />
                            <DynamicChart
                                title="Newsletters abertos no ultimo dia"
                                description="Acompanhe a quantidade de newsletters abertos no ultimo dia"
                                chartData={dayChartData}
                                chartConfig={chartConfig}
                            />
                        </div>
                    )
                }
            </div>
        </Card>
    )
}