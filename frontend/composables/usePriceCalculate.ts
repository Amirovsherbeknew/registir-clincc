export const usePriceCalculate = (list:any) => {
    let price = 0;

    list?.forEach((resp:any) => {
        price = price + Number(resp.price)
    })
    return useCurrencyFormat(price)
}