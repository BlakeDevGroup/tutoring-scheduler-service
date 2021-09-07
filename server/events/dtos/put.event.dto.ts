export interface PutEventDto {
    date_start: string;
    date_end: string;
    all_day: Boolean;
    title: string;
    calendar_id: number;
    user_id: number;
    description: string;
}
