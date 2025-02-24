import { IAccordionUsersInformation } from "./accordion-users-information";
import { Skeleton } from "./skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

interface ITableUsersInformatio extends IAccordionUsersInformation {

}

export function TableUsersInformation({ loading, users }: ITableUsersInformatio) {
    return (
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
    )
}