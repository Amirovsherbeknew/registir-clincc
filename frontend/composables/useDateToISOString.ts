export function useDateToISOString(
    input: string | Date | number,
    options?: { endOfDay?: boolean }
  ): string {
    if (!input) {
        return input
    }
    const isISOString = (value: string) => {
      return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value);
    };
  
    if (typeof input === 'string') {
      if (isISOString(input)) {
        return input;
      }
  
      // Agar 'YYYY-MM-DD' format bo‘lsa, unga vaqt qo‘shamiz
      const todayRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (todayRegex.test(input)) {
        const date = new Date(input + 'T00:00:00Z');
  
        if (options?.endOfDay) {
          date.setUTCHours(23, 59, 59, 999);
        }
  
        return date.toISOString();
      }
    }
  
    const date = new Date(input);
  
    if (!isNaN(date.getTime())) {
      if (options?.endOfDay) {
        date.setUTCHours(23, 59, 59, 999);
      }
      return date.toISOString();
    }
  
    throw new Error('Invalid date input');
  }
  