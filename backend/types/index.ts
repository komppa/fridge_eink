export type Periods = {
    open: {
        day: number
        time: string
    }
    close: {
        day: number
        time: string
    }
}[]

export type InputData = {
    opening_hours: {
        periods: Periods
    }
}

export type OutputData = {
    [key: string]: [string, string]
}
