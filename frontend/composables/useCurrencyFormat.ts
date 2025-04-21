// composables/useCurrencyFormat.js

export function useCurrencyFormat(amount:number) {
    if (isNaN(amount)) return amount
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'som',
      minimumFractionDigits: 0,
    }).format(amount)
  }
  