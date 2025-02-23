import { FireStreak } from "@/assets/svg/fire-streak";
import { SnowFlakeStreak } from "@/assets/svg/snow-flake-streak";
import { DayProps } from "react-day-picker";

interface IDayCell extends DayProps {
    daysReaded: Date[] | undefined
}

export function DayCell(props: IDayCell) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const daysReadedFormatted = props.daysReaded?.map((dayReaded) => {
        const date = new Date(dayReaded);
        date.setUTCHours(0, 0, 0, 0);
        return date;
    });

    const isUserReadedNewsletter = daysReadedFormatted?.some((dayReaded) => {
        const currentDate = new Date(props.date);
        currentDate.setUTCHours(0, 0, 0, 0);
        return dayReaded.getTime() === currentDate.getTime();
    });

    const isPastOrToday = props.date.getTime() <= today.getTime();
    const isSunday = props.date.getDay() === 0;
    const isWeekend = props.date.getDay() === 0 || props.date.getDay() === 6;
    const dayOfMonth = props.date.getDate();
    const firstDayReaded = daysReadedFormatted?.[0].getTime();
    const isNotValidDayForEmoji = isSunday || (firstDayReaded && props.date.getTime() < firstDayReaded);

    return (
        <div className={`w-full h-10 flex justify-center items-center rounded-xl relative ${today.getTime() == props.date.getTime() ? "bg-supernova-400 text-zinc-900" : "text-zinc-500"} ${!isWeekend ? "text-zinc-900" : "text-zinc-500"}`}>
            {!isNotValidDayForEmoji && (
                isPastOrToday && isUserReadedNewsletter ? (
                    <FireStreak className="absolute top-0.5 right-2 lg:size-4" />
                ) : (
                    isPastOrToday && <SnowFlakeStreak className="absolute top-0.5 right-2 lg:size-4" />
                )
            )}
            {dayOfMonth}
        </div>
    )
}