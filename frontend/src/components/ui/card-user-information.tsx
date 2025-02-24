import { ReactNode } from "react"

interface ICardUserInformation {
    icon: ReactNode
    title: string
    description: string
}

export function CardUserInformation({ icon, title, description }: ICardUserInformation) {
    return (
        <div className="w-full h-32 flex flex-col col-span-1 p-4 bg-zinc-50 rounded-lg items-center justify-center lg:h-40 lg:p-6">
            <div className="flex flex-col w-full h-full justify-evenly items-start">
                {icon}
                <span className="font-semibold leading-5 lg:text-lg">
                    {title}
                </span>
                <span className="text-sm lg:text-base">
                    {description}
                </span>
            </div>
        </div>
    )
}