export function formatDateUTC(dateInput: string | Date): string {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    return date.toISOString().split("T")[0];
}