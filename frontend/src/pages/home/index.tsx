import { useLocation, useNavigate } from "react-router";
import { TheNewsIcon } from "../../assets/svg/the-news-icon";
import { LogOut } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from 'date-fns/locale';
import { DayCell } from "@/components/ui/day-cell";
import { FireStreak } from "@/assets/svg/fire-streak";
import { SnowFlakeStreak } from "@/assets/svg/snow-flake-streak";
import { CardUserInformation } from "@/components/ui/card-user-information";
import { CheckMark } from "@/assets/svg/check-mark";
import { FirstPlaceMedal } from "@/assets/svg/first-place-medal";
import { Percentage } from "@/assets/svg/percentage";
import { BookOpened } from "@/assets/svg/book-opened";
import { useMediaQuery } from 'react-responsive';
import { useEffect, useState } from "react";
import { IUser, useUser } from "@/contexts/user-context";
import api from "@/service/api";
import axios from "axios";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton";
import { emojis } from "@/utils/emojis";
import { UserCalendar } from "@/components/ui/user-calendar";
import { CardsUserInformationsContainer } from "@/components/ui/cards-user-informations-container";

export function Home() {
    const { user, setUser } = useUser()
    const [loading, setLoading] = useState(false);
    const [timeOfTheDay, setTimeOfTheDay] = useState("");
    const [numberOfMonths, setNumberOfMonths] = useState(1);
    const location = useLocation()
    const navigate = useNavigate()

    async function getUserInformation(email: string) {
        setLoading(true);
        try {
            const response = await api.get(`/user?email=${email}`);
            setUser(response.data)
            setLoading(false);
        } catch (e) {
            if (axios.isAxiosError(e)) {
                console.error("Axios error:", e.response?.data || e.message);
                toast.error(e.response?.data?.message || "Aconteceu um erro inesperado, tente novamente mais tarde");
            } else {
                console.error("Unexpected error:", e);
                toast.error("Aconteceu um erro inesperado, tente novamente mais tarde");
            }
            setTimeout(() => {
                setLoading(false);
                navigate("/login")
            }, 3000)
        }
    }

    useEffect(() => {
        if (!user || location.pathname !== `/${user.email}`) {
            const email = location.pathname.replace("/", "");
            getUserInformation(email)
        }

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

    const handleGoBackToLoginPage = () => {
        setUser({} as IUser);
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
                                Sua sequência atual de <span className="text-supernova-400 font-bold">STREAKS</span> é de {" "}
                                {
                                    loading ? (
                                        <Skeleton className="w-24 h-6 inline-flex -mb-1" />
                                    ) : (
                                        <span className="text-supernova-400 font-bold inline-flex items-center gap-1">
                                            {user?.streak} dias
                                            {emojis[user?.emoji]}
                                        </span>
                                    )
                                }
                            </p>
                            <p className="leading-6 text-zinc-600 lg:text-lg">
                                {
                                    loading ? (
                                        <Skeleton className="w-full h-5" />
                                    ) : (
                                        user?.motivational_message
                                    )
                                }
                            </p>
                        </div>
                    </div>
                    <UserCalendar
                        loading={loading}
                        user={user}
                        numberOfMonths={numberOfMonths}
                    />
                </main>
                <CardsUserInformationsContainer
                    loading={loading}
                    user={user}
                />
                <footer className="w-full flex justify-center items-center bg-zinc-200 p-5">
                    <span className="text-zinc-600 text-center text-sm lg:text-base">
                        Esses dados estão associados ao e-mail {" "}
                        <span className="text-cyan-500 underline">
                            {
                                loading ? (
                                    <Skeleton className="w-24 h-5 inline-flex -mb-1" />
                                ) : (
                                    ` ${user?.email}`
                                )
                            }
                        </span>
                    </span>
                </footer>
            </div>
        </div>
    )
}