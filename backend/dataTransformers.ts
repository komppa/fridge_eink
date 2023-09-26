import { InputData, OutputData } from './types'


const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

// Transform the opening hours data from the Google Places API into a more usable format
// where the days are ordered from Monday to Sunday and the times are formatted as HH:MM (24h)
export const transformOpeningHours = (data: InputData): OutputData => {

    const formatTime = (timeString: string): string => {
        
        const hour = parseInt(timeString.substring(0, 2), 10)
        const minute = parseInt(timeString.substring(2, 4), 10)
        const formatted = new Date(2000, 0, 1, hour, minute).toLocaleTimeString("en-US", {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
        
        return formatted
    }

    let openingHours: OutputData = {}

    data.opening_hours.periods.forEach(period => {
        const day = days[(period.open.day - 1 + 7) % 7] 
        const openTime = formatTime(period.open.time)
        const closeTime = formatTime(period.close.time)
        openingHours[day] = [openTime, closeTime]
    })

    // Flip the order of the days
    const orderedHours: OutputData = {}
    days.forEach(day => orderedHours[day] = openingHours[day])

    return orderedHours
}
