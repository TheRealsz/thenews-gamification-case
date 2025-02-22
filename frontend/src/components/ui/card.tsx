import { ReactNode } from "react"

interface ICard {
    icon: ReactNode
    title: string
    description: string
}

export function Card({ icon, title, description }: ICard) {
    return (
        <div className="w-full h-32 flex flex-col col-span-1 p-4 bg-zinc-50 rounded-lg items-center justify-center">
            <div className="flex flex-col w-full h-full justify-evenly items-start">
                {icon}
                <span className="font-semibold leading-5">
                    {title}
                </span>
                <span className="text-sm">
                    {description}
                </span>
            </div>
        </div>
    )
}