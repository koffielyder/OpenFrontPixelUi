export function formatNumber(num: number): string {
    const absNum = Math.abs(num);
    let formattedNumber: string;

    if (absNum >= 1000000) {
        formattedNumber = (absNum / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (absNum >= 1000) {
        formattedNumber = (absNum / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    } else {
        formattedNumber = absNum.toString();
    }

    return num < 0 ? '-' + formattedNumber : formattedNumber;
}