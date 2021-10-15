
export function daysToYears(days) {
    var years = Math.floor(days / 365)
    return years
}

export function days(days) {
    var day = Math.floor(days - daysToYears(days) * 365)
    return day
}