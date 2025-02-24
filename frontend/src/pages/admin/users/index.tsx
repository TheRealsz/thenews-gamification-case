import { AccordionUsersInformation } from "@/components/ui/accordion-users-information";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DynamicPagination } from "@/components/ui/dynamic-pagination";
import { FilterDialog } from "@/components/ui/filter-dialog";
import { TableUsersInformation } from "@/components/ui/table-users-information";
import api from "@/service/api";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export interface IUsers {
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
        } catch (e) {
            if (axios.isAxiosError(e)) {
                console.error("Axios error:", e.response?.data || e.message);
                toast.error(e.response?.data?.message || "Aconteceu um erro inesperado, tente novamente mais tarde");
            } else {
                console.error("Unexpected error:", e);
                toast.error("Aconteceu um erro inesperado, tente novamente mais tarde");
            }
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
                    <AccordionUsersInformation
                        loading={loading}
                        users={users}
                    />
                    <TableUsersInformation
                        loading={loading}
                        users={users}
                    />
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