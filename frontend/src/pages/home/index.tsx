import { useNavigate } from "react-router";
import { TheNewsIcon } from "../../assets/svg/the-news-icon";
import { LogOut } from 'lucide-react';
import { SmilingFaceWithSunglasses } from "../../assets/svg/smiling-face-with-sunglasses";

export function Home() {

    const navigate = useNavigate()

    const date = new Date()
    const hours = date.getHours()
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


    return (
        <div className="w-full h-dvh flex flex-col justify-start items-center gap-9 p-5 bg-zinc-200 md:p-0 relative">
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
            </main>
            <footer className="fixed bottom-0 w-full flex justify-center items-center bg-zinc-200 p-5">
                <span className="text-zinc-600 text-center text-sm">
                    Esses dados estão associados ao e-mail robson.diego@email.com
                </span>
            </footer>
        </div>
    )
}