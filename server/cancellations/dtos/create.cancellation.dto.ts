export interface CreateCancellationDto {
    amount: number;
    reason: string;
    id: number;
    source: string;
    excluded_dates: string[];
}
