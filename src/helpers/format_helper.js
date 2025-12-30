export function convertToAMPM(time) {
    const [hours, minutes, seconds] = time.split(':');

    const date = new Date(1970, 0, 1, hours, minutes, seconds);
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    };
    return date.toLocaleTimeString('en-US', options);
}
