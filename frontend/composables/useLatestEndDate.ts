export function useLatestEndDate(clients: Array<{ end_date: string }>,type='lastest') {
  if (!clients || clients.length === 0) return null;

  const sorted = clients
    .filter(c => c.end_date)
    .sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime());

    if (type === 'firstest' && sorted[sorted.length - 1]?.end_date) {
        return useDateFormat(sorted[sorted.length - 1]?.end_date)
    }
    if (sorted[0]?.end_date) {
        return useDateFormat(sorted[0]?.end_date)
    }
    return sorted[0]?.end_date || null;
}
