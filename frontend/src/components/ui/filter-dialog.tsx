import { Filter } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { DynamicSelect } from "./dynamic-select";

export function FilterDialog() {
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
                                defaultValue={"best_streak"}
                                placeholder="Selecione um filtro"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="">Ordem</label>
                            <DynamicSelect
                                label="Selecione uma ordenação"
                                options={[
                                    { label: "Crescente", value: "asc" },
                                    { label: "Decrescente", value: "desc" },
                                ]}
                                defaultValue={"desc"}
                                placeholder="Selecione uma ordenação"
                            />
                        </div>
                        <button className="bg-supernova-400 text-zinc-900 px-4 py-2 rounded-lg font-medium">
                            Filtrar
                        </button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}