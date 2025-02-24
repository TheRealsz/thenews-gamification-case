import { IUser } from "@/contexts/user-context";
import { Skeleton } from "./skeleton";
import { CardUserInformation } from "./card-user-information";
import { CheckMark } from "@/assets/svg/check-mark";
import { FirstPlaceMedal } from "@/assets/svg/first-place-medal";
import { Percentage } from "@/assets/svg/percentage";
import { BookOpened } from "@/assets/svg/book-opened";

interface ICardsUserInformationsContainer {
    loading: boolean;
    user: IUser | undefined;
}

export function CardsUserInformationsContainer({ loading, user }: ICardsUserInformationsContainer) {
    return (
        <div className="grid grid-cols-2 gap-x-6 items-center justify-center gap-y-6 w-full lg:flex">
            {
                loading ? (
                    <>
                        <Skeleton className="w-full h-32 col-span-1 lg:h-40" />
                        <Skeleton className="w-full h-32 col-span-1 lg:h-40" />
                        <Skeleton className="w-full h-32 col-span-1 lg:h-40" />
                        <Skeleton className="w-full h-32 col-span-1 lg:h-40" />
                    </>
                ) : (
                    <>
                        <CardUserInformation
                            icon={<CheckMark className="size-10 lg:size-12" />}
                            title={`${user?.total_days_readed} dias`}
                            description="Totais de leitura"
                        />
                        <CardUserInformation
                            icon={<FirstPlaceMedal className="size-10 lg:size-11" />}
                            title={`${user?.best_streak} dias`}
                            description="Melhor streak"
                        />
                        <CardUserInformation
                            icon={<Percentage className="size-10 lg:size-11" />}
                            title={`${user?.percentage_of_days_readed}%`}
                            description="Taxa geral de leitura"
                        />
                        <CardUserInformation
                            icon={<BookOpened className="size-10 lg:size-11" />}
                            title={`${user?.total_days_readed_on_current_month} dias`}
                            description="Lidos neste mês"
                        />
                    </>
                )
            }
        </div>
    )
}