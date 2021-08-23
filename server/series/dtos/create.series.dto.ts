export interface CreateSeriesDto {
    title: string;
    description?: string;
    recurrence: string;
    start: string;
    end: string;
    calendarId: string;
}
