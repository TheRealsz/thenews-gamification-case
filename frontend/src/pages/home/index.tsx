import { useNavigate } from "react-router";
import { TheNewsIcon } from "../../assets/svg/the-news-icon";
import { LogOut } from 'lucide-react';
import { SmilingFaceWithSunglasses } from "../../assets/svg/smiling-face-with-sunglasses";
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
import { useMediaQuery } from 'react-responsive';
import { useEffect, useState } from "react";

export function Home() {

    const navigate = useNavigate()

    const [timeOfTheDay, setTimeOfTheDay] = useState("");
    const [numberOfMonths, setNumberOfMonths] = useState(1);

    useEffect(() => {
        const today = new Date();
        const hours = today.getHours();

        if (hours >= 0 && hours < 12) {
            setTimeOfTheDay("Bom dia");
        } else if (hours >= 12 && hours < 18) {
            setTimeOfTheDay("Boa tarde");
        } else {
            setTimeOfTheDay("Boa noite");
        }
    }, []);

    const today = new Date()
    const hours = today.getHours()

    const handleGoBackToLoginPage = () => {
        navigate("/login")
    }

    const isSmallScreen = useMediaQuery({ query: '(max-width: 640px)' });
    const isMediumScreen = useMediaQuery({ query: '(min-width: 641px)' });

    useEffect(() => {
        if (isSmallScreen) {
            setNumberOfMonths(1);
        } else if (isMediumScreen) {
            setNumberOfMonths(2);
        }
    }, [isSmallScreen, isMediumScreen]);



    return (
        <div className="w-full h-full flex flex-col justify-start items-center p-5 bg-zinc-200 relative md:px-10 lg:py-7">
            <div className="w-full flex flex-col justify-center items-center gap-9 max-w-6xl lg:gap-12">
                <nav className="w-full flex justify-between items-center">
                    <TheNewsIcon className="w-36 h-9 lg:w-44 lg:h-10" />
                    <LogOut className="text-red-500 cursor-pointer size-6 lg:size-7" onClick={handleGoBackToLoginPage} />
                </nav>
                <main className="w-full flex flex-col gap-10 lg:gap-12">
                    <div className="w-full flex flex-col gap-6 lg:gap-7">
                        <h1 className="font-bold text-3xl leading-6 text-zinc-900 lg:text-4xl">
                            Olá, {timeOfTheDay}!
                        </h1>
                        <div className="flex flex-col gap-2">
                            <p className="leading-6 text-lg lg:text-xl">
                                Sua sequência atual de <span className="text-supernova-400 font-bold">STREAKS</span> é de <span className="text-supernova-400 font-bold inline-flex items-center gap-1">22 dias <SmilingFaceWithSunglasses className="size-6" /></span>
                            </p>
                            <p className="leading-6 text-zinc-600 lg:text-lg">
                                Você está voando! Essa consistência está te levando a um novo nível!
                            </p>
                        </div>
                    </div>
                    <div className="w-full h-full flex flex-col gap-7">
                        <Calendar
                            mode="default"
                            numberOfMonths={numberOfMonths}
                            className="border rounded-md w-full h-full"
                            locale={ptBR}
                            showOutsideDays
                            components={{
                                Day: DayCell
                            }}
                            classNames={{
                                months: "flex flex-col sm:flex-row gap-5 lg:gap-10",
                                month: "flex-1",
                                caption: "flex justify-center py-2 relative items-center w-full",
                                caption_label: "lg:text-base capitalize",
                                head_cell: "lg:text-base font-normal text-zinc-600",
                                cell: "lg:text-lg"
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
                            <p className="text-sm text-zinc-600 lg:text-base">
                                Legenda:
                            </p>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1">
                                    <FireStreak className="size-4 lg:size-5" />
                                    <span className="text-sm text-zinc-600 lg:text-base">
                                        Dia com leitura registrada
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <SnowFlakeStreak className="size-4 lg:size-5" />
                                    <span className="text-sm text-zinc-600 lg:text-base">
                                        Dia sem leitura registrada
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <div className="grid grid-cols-2 gap-x-6 items-center justify-center gap-y-6 w-full lg:flex">
                    <Card
                        icon={<CheckMarkIcon className="size-10 lg:size-12" />}
                        title="40 dias"
                        description="totais de leitura"
                    />
                    <Card
                        icon={<FirstPlaceMedalIcon className="size-10 lg:size-11" />}
                        title="22 dias"
                        description="Melhor streak"
                    />
                    <Card
                        icon={<PercentageIcon className="size-10 lg:size-11" />}
                        title="33%"
                        description="Taxa geral de leitura"
                    />
                    <Card
                        icon={<BookOpenedIcon className="size-10 lg:size-11" />}
                        title="21 dias"
                        description="Lidos em fevereiro"
                    />
                </div>
                <footer className="w-full flex justify-center items-center bg-zinc-200 p-5">
                    <span className="text-zinc-600 text-center text-sm">
                        Esses dados estão associados ao e-mail <span className="text-cyan-500 underline">robson.diego@email.com</span>
                    </span>
                </footer>
            </div>
        </div>
    )
}