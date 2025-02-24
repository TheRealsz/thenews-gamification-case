import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DynamicPagination } from "@/components/ui/dynamic-pagination";
import { FilterDialog } from "@/components/ui/filter-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/service/api";
import { useEffect, useState } from "react";

interface IUsers {
    id: number;
    email: string;
    streak: number;
    best_streak: number;
    total_days_readed: number;
}


export function UsersStatistic() {
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState<IUsers[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [filters, setFilters] = useState({
        orderBy: "best_streak",
        orderDir: "desc"
    })

    const filterOptions: { [key: string]: string } = {
        streak: "Sequência atual",
        best_streak: "Melhor sequência",
        total_days_readed: "Dias lidos",
        asc: "Menor para o maior",
        desc: "Maior para o menor"
    }

    async function getUsersInformation() {
        setLoading(true)
        try {
            const response = await api.get(`users/ranking?orderBy=${filters.orderBy}&order=${filters.orderDir}&page=${currentPage}`)
            setUsers(response.data.usersRanking)
            setCurrentPage(response.data.page)
            setTotalPages(response.data.totalPages)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getUsersInformation()
    }, [currentPage, filters])

    return (
        <Card className="rounded-xl py-4 w-full">
            <div className="w-full rounded-[10px] flex flex-col gap-4">
                <CardHeader>
                    <div className="mb-4 flex flex-col gap-2">
                        <CardTitle className="text-xl text-zinc-900 md:text-2xl">Estatísticas de usuários</CardTitle>
                        <CardDescription className="md:text-lg text-base">
                            Acompanhe as estatísticas dos usuários cadastrados no sistema
                        </CardDescription>
                    </div>
                </CardHeader>
                <div className="w-full flex px-4 items-end">
                    <div className="flex flex-col gap-1 flex-1 w-full">
                        <p className="text-muted-foreground">
                            Filtros aplicados:
                        </p>
                        <div className="flex gap-2 flex-wrap">
                            <span className="bg-supernova-400 text-zinc-900 px-2 py-1 rounded-lg flex items-center justify-center text-xs">
                                {filterOptions[filters.orderBy]}
                            </span>
                            <span className="bg-supernova-400 text-zinc-900 px-2 py-1 rounded-lg flex items-center justify-center text-xs">
                                {filterOptions[filters.orderDir]}
                            </span>
                        </div>
                    </div>
                    <FilterDialog
                        filters={filters}
                        setFilters={setFilters}
                    />
                </div>
                <div className="flex flex-col gap-12">
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
                    <div className="w-full px-4 overflow-x-auto hidden lg:block">
                        {
                            loading ? (
                                <Skeleton className="w-full h-80" />
                            ) :
                                (
                                    <Table className="w-full table-auto">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>ID</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Streak</TableHead>
                                                <TableHead>Melhor Streak</TableHead>
                                                <TableHead>Total de dias de leitura</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {
                                                users.map(
                                                    (item, _) => (
                                                        <TableRow className="" key={item.id}>
                                                            <TableCell className="font-medium">{item.id}</TableCell>
                                                            <TableCell className="font-medium">{item.email}</TableCell>
                                                            <TableCell className="font-medium">{item.streak}</TableCell>
                                                            <TableCell className="font-medium">{item.best_streak}</TableCell>
                                                            <TableCell className="font-medium">{item.total_days_readed}</TableCell>
                                                        </TableRow>
                                                    )
                                                )
                                            }
                                        </TableBody>
                                    </Table>
                                )
                        }
                    </div>
                    <DynamicPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                        maxPagesOnPagination={5}
                    />
                </div>
            </div>
        </Card>
    )
}