
export interface Result {
    studentSelection:  StudentSelection;
}

export interface StudentSelection {
    id:          number;
    start:       string;
    end: string;
    isAfterStart:        boolean;
    isInPeriod:    boolean;
}