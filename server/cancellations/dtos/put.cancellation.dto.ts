export interface PutCancellationDto {
    amount: number;
    reason: string;
    id: number;
    source: string;
    excluded_dates: string[];
}
