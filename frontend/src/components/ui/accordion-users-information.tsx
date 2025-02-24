import { IUsers } from "@/pages/admin/users";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";
import { Skeleton } from "./skeleton";

export interface IAccordionUsersInformation {
    loading: boolean;
    users: IUsers[]
}

export function AccordionUsersInformation({ loading, users }: IAccordionUsersInformation) {
    return (
        <div className="w-full px-4 lg:hidden">
            <Accordion type="single" collapsible className="w-full mt-5">
                {
                    loading ? (
                        <div className="w-full flex flex-col gap-4">
                            <Skeleton className="w-full h-10" />
                            <Skeleton className="w-full h-10" />
                            <Skeleton className="w-full h-10" />
                            <Skeleton className="w-full h-10" />
                            <Skeleton className="w-full h-10" />
                        </div>
                    ) :
                        (
                            users.map(
                                (item, _) => (
                                    <AccordionItem key={item.id} value={`item-${item.id}`} className="font-medium">
                                        <AccordionTrigger className="text-left">{item.email}</AccordionTrigger>
                                        <AccordionContent>
                                            <span className="text-muted-foreground">ID: </span>
                                            {item.id}
                                        </AccordionContent>
                                        <AccordionContent>
                                            <span className="text-muted-foreground">Streak: </span>
                                            {item.streak}
                                        </AccordionContent>
                                        <AccordionContent>
                                            <span className="text-muted-foreground">Melhor Streak: </span>
                                            {item.best_streak}
                                        </AccordionContent>
                                        <AccordionContent>
                                            <span className="text-muted-foreground">Total de dias de leitura: </span>
                                            {item.total_days_readed}
                                        </AccordionContent>
                                    </AccordionItem>
                                )
                            )
                        )
                }
            </Accordion>
        </div>
    )
}