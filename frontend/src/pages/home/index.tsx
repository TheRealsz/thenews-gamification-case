import { useNavigate } from "react-router";
import { TheNewsIcon } from "../../assets/svg/the-news-icon";
import { LogOut } from 'lucide-react';
import { SmilingFaceWithSunglasses } from "../../assets/svg/smiling-face-with-sunglasses";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from 'date-fns/locale';
import { DayCell } from "@/components/ui/day-cell";
import { FireStreak } from "@/assets/svg/fire-streak";
import { SnowFlakeStreak } from "@/assets/svg/snow-flake-streak";
import { Card } from "@/components/ui/card";
import { CheckMarkIcon } from "@/assets/svg/check-mark";
import { FirstPlaceMedalIcon } from "@/assets/svg/first-place-medal";
import { PercentageIcon } from "@/assets/svg/percentage";
import { BookOpenedIcon } from "@/assets/svg/book-opened";

export function Home() {

    const navigate = useNavigate()
    const [date, setDate] = useState<Date | undefined>(new Date())

    const today = new Date()
    const hours = today.getHours()
    let timeOfTheDay = ""

    if (hours >= 0 && hours < 12) {
        timeOfTheDay = "Bom dia"
    } else if (hours >= 12 && hours < 18) {
        timeOfTheDay = "Boa tarde"
    } else {
        timeOfTheDay = "Boa noite"
    }

    const handleGoBackToLoginPage = () => {
        navigate("/login")
    }

    const bookedDays = [
        new Date(2025, 2, 18),
        new Date(2021, 2, 19),
        new Date(2021, 2, 20)
    ];

    return (
        <div className="w-full h-full flex flex-col justify-start items-center gap-9 p-5 bg-zinc-200 relative md:px-10">
            <nav className="w-full flex justify-between items-center">
                <TheNewsIcon width={146} height={34} />
                <LogOut size={24} className="text-red-500 cursor-pointer" onClick={handleGoBackToLoginPage} />
            </nav>
            <main className="w-full flex flex-col gap-10">
                <div className="w-full flex flex-col gap-6">
                    <h1 className="font-bold text-3xl leading-6 text-zinc-900">
                        Olá, {timeOfTheDay}!
                    </h1>
                    <div className="flex flex-col gap-2">
                        <div>
                            <p className="leading-6 text-lg">
                                Sua sequência atual de <span className="text-supernova-400 font-bold">STREAKS</span> é de <span className="text-supernova-400 font-bold inline-flex items-center gap-1">22 dias <SmilingFaceWithSunglasses /></span>
                            </p>
                        </div>
                        <p className="leading-6 text-zinc-600">
                            Você está voando! Essa consistência está te levando a um novo nível!
                        </p>
                    </div>
                </div>
                <div className="w-full h-full flex flex-col gap-7">
                    <Calendar
                        mode="default"
                        numberOfMonths={3}
                        className="border rounded-md w-full h-full"
                        locale={ptBR}
                        components={{
                            Day: DayCell
                        }}
                        showOutsideDays
                        classNames={{
                            months: "flex flex-col md:flex-row gap-10 w-full flex-1",
                            month: "flex-1",
                        }}
                        styles={{
                            cell: {
                                width: "100%",
                            },
                            head_cell: {
                                width: "100%",
                            },
                        }}
                    />
                    <div className="flex flex-col gap-1">
                        <p className="text-sm text-zinc-600">
                            Legenda:
                        </p>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                                <FireStreak width={15} height={15} />
                                <span className="text-sm text-zinc-600">
                                    Dia com leitura registrada
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <SnowFlakeStreak width={15} height={15} />
                                <span className="text-sm text-zinc-600">
                                    Dia sem leitura registrada
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div className="grid grid-cols-2 gap-x-6 items-center justify-center gap-y-6 w-full ">
                <Card
                    icon={<CheckMarkIcon />}
                    title="40 dias"
                    description="totais de leitura"
                />
                <Card
                    icon={<FirstPlaceMedalIcon />}
                    title="22 dias"
                    description="Melhor streak de leitura"
                />
                <Card
                    icon={<PercentageIcon />}
                    title="33%"
                    description="Taxa geral de leitura"
                />
                <Card
                    icon={<BookOpenedIcon />}
                    title="21 dias"
                    description="Lidos em fevereiro"
                />
            </div>
            <footer className="w-full flex justify-center items-center bg-zinc-200 p-5">
                <span className="text-zinc-600 text-center text-sm">
                    Esses dados estão associados ao e-mail robson.diego@email.com
                </span>
            </footer>
        </div>
    )
}