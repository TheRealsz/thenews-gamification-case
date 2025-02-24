import { Filter } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { DynamicSelect } from "./dynamic-select";

interface IFilterDialog {
    filters: {
        orderBy: string;
        orderDir: string;
    }
    setFilters: (filters: { orderBy: string; orderDir: string }) => void;
}

export function FilterDialog({ filters, setFilters }: IFilterDialog) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex justify-end px-4">
                    <button className="flex items-center gap-2 bg-supernova-400 text-zinc-900 px-4 py-2 rounded-lg font-medium">
                        <Filter size={24} className="text-zinc-900" />
                        Filtrar
                    </button>
                </div>
            </DialogTrigger>
            <DialogContent className="w-11/12 rounded-2xl">
                <DialogHeader>
                    <DialogTitle>Filtros</DialogTitle>
                </DialogHeader>
                <div className="p-4">
                    <form className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="">Filtrar por:</label>
                            <DynamicSelect
                                label="Selecione um filtro"
                                options={[
                                    { label: "Sequência atual", value: "streak" },
                                    { label: "Melhor sequência", value: "best_streak" },
                                    { label: "Dias lidos", value: "total_days_readed" },
                                ]}
                                defaultValue={filters.orderBy}
                                placeholder="Selecione um filtro"
                                onChangeCallback={(option) => setFilters({ ...filters, orderBy: option })}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="">Ordem</label>
                            <DynamicSelect
                                label="Selecione uma ordenação"
                                options={[
                                    { label: "Menor para o maior", value: "asc" },
                                    { label: "Maior para o menor", value: "desc" },
                                ]}
                                defaultValue={filters.orderDir}
                                placeholder="Selecione uma ordenação"
                                onChangeCallback={(option) => setFilters({ ...filters, orderDir: option })}
                            />
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}