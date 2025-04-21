export const useTrim = () => {
    return (rule: any, value: string, callback: any) => {
        if (!value || !value.trim()) {
            callback(new Error(" "));
        } else {
            callback();
        }
    }
}