import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./pagination"

interface IDynamicPagination {
    currentPage: number
    totalPages: number
    setCurrentPage: Dispatch<SetStateAction<number>>
    maxPagesOnPagination: number
}

export function DynamicPagination({ currentPage, totalPages, setCurrentPage, maxPagesOnPagination }: IDynamicPagination) {

    const [quantityOfPagesSliced, setQuantityOfPagesSliced] = useState<number[]>([])

    useEffect(() => {
        const startPage = Math.max(currentPage - maxPagesOnPagination / 2, 1);
        const endPage = Math.min(startPage + maxPagesOnPagination - 1, totalPages);

        const pages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
        setQuantityOfPagesSliced(pages);
    }, [currentPage, totalPages]);

    function handleGoToPreviousPage() {
        const previousPage = Math.max(1, currentPage - 1);
        setCurrentPage(previousPage);
    }

    function handleGoToNextPage() {
        const nextPage = Math.min(totalPages, currentPage + 1);
        setCurrentPage(nextPage);
    }

    return (
        <Pagination className="mb-4">
            <PaginationContent>
                <PaginationItem className="cursor-pointer" onClick={handleGoToPreviousPage}>
                    <PaginationPrevious />
                </PaginationItem>
                {
                    totalPages > maxPagesOnPagination && quantityOfPagesSliced[0] !== 1 &&
                    <PaginationEllipsis />
                }
                {
                    quantityOfPagesSliced.map(page =>
                        <PaginationItem
                            key={page}
                        >
                            <PaginationLink
                                className={`cursor-pointer ${currentPage === page ? 'bg-supernova-400 text-zinc-900' : ''}`}
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    )
                }
                {
                    totalPages > maxPagesOnPagination && quantityOfPagesSliced[quantityOfPagesSliced.length - 1] !== totalPages &&
                    <PaginationEllipsis />
                }
                <PaginationItem className="cursor-pointer" onClick={handleGoToNextPage}>
                    <PaginationNext />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}