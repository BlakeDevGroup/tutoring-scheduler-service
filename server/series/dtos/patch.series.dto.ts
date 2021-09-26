export interface PatchSeriesDto {
    title: string;
    description?: string;
    calendar_id: number;
    start_time: string;
    end_time: string;
    start_recur: string;
    end_recur: string;
    days_of_week: number[];
    user_id: string;
    company_id: string;
}
