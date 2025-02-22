import { FireStreak } from "@/assets/svg/fire-streak";
import { SnowFlakeStreak } from "@/assets/svg/snow-flake-streak";
import { DayProps } from "react-day-picker";

export function DayCell(props: DayProps) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const bookedDays = [
        new Date(2025, 1, 18),
        new Date(2025, 1, 19),
        new Date(2025, 1, 20)
    ];

    console.log(props.date.getTime() < today.getTime())

    const isBookedDay = bookedDays.some((bookedDay) => bookedDay.getTime() === props.date.getTime());
    const isPastOrToday = props.date.getTime() <= today.getTime();

    return (
        <div className={`w-full h-10 flex justify-center items-center rounded-md relative ${today.getTime() == props.date.getTime() ? "bg-supernova-400 text-zinc-900" : "text-zinc-500"}`}>
            {
                isPastOrToday && isBookedDay ? (
                    <FireStreak className="absolute top-0.5 right-0.5" />
                ) : (
                    isPastOrToday && <SnowFlakeStreak className="absolute top-0.5 right-0.5" />
                )
            }
            {props.date.getDate()}
        </div>
    )
}