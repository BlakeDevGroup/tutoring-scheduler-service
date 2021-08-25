export interface PutEventDto {
    dateStart: string;
    dateEnd: string;
    allDay: Boolean;
    title: string;
    calendarId: number;
    userId: number;
}
