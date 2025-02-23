export function formatDateWithoutHours(date: Date | string) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    return date.toISOString().split('T')[0];
}

export function formatDateUTC(dateInput: string | Date): string {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    return date.toISOString().split("T")[0];
}