export const fomratTimeDuration = (time: number): string => {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;

    if (hours > 0 && minutes > 0) {
        return `${hours}h ${minutes} min`
    } else if (hours > 0) {
        return `${hours}h`
    } else {
        return `${minutes} min`
    }
}