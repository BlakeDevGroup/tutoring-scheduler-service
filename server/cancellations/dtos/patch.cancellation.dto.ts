export interface PatchCancellationDto {
    amount: number;
    reason: string;
    id: number;
    source: string;
    excluded_dates: string[];
}
