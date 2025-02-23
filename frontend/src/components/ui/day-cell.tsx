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

    const isBookedDay = bookedDays.some((bookedDay) => bookedDay.getTime() === props.date.getTime());
    const isPastOrToday = props.date.getTime() <= today.getTime();
    const isSunday = props.date.getDay() === 0;
    const isWeekend = props.date.getDay() === 0 || props.date.getDay() === 6;

    return (
        <div className={`w-full h-10 flex justify-center items-center rounded-xl relative ${today.getTime() == props.date.getTime() ? "bg-supernova-400 text-zinc-900" : "text-zinc-500"} ${!isWeekend ? "text-zinc-900" : "text-zinc-500"}`}>
            {!isSunday && (
                isPastOrToday && isBookedDay ? (
                    <FireStreak className="absolute top-0.5 right-2 lg:size-4" />
                ) : (
                    isPastOrToday && <SnowFlakeStreak className="absolute top-0.5 right-2 lg:size-4" />
                )
            )}
            {props.date.getDate()}
        </div>
    )
}