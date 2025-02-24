import { FireStreak } from "@/assets/svg/fire-streak";
import { Calendar } from "./calendar";
import { DayCell } from "./day-cell";
import { Skeleton } from "./skeleton";
import { ptBR } from "date-fns/locale";
import { SnowFlakeStreak } from "@/assets/svg/snow-flake-streak";
import { IUser } from "@/contexts/user-context";

interface IUserCalendar {
    loading: boolean;
    user: IUser | undefined;
    numberOfMonths: number;
}


export function UserCalendar({ loading, user, numberOfMonths }: IUserCalendar) {
    return (
        <div className="w-full h-full flex flex-col gap-7">
            {
                loading ? (
                    <Skeleton className="w-full h-80 sm:h-96" />
                ) : (
                    <Calendar
                        mode="default"
                        numberOfMonths={numberOfMonths}
                        className="border rounded-md w-full h-full"
                        locale={ptBR}
                        components={{
                            Day: (props) => <DayCell {...props} daysReaded={user?.days_readed} />
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
                )
            }
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
    )
}