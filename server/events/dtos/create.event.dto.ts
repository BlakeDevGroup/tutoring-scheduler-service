export interface CreateEventDto {
    // event_id: string;
    date_start: string;
    date_end: string;
    all_day: Boolean;
    title: string;
    calendar_id: number;
    user_id: number;
}
