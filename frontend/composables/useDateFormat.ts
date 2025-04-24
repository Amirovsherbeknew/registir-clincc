export const useDateFormat = (date: any) => {
    const d = new Date(date)
    return d.toLocaleDateString('uz-UZ') + ' ' + d.toLocaleTimeString('uz-UZ')
}