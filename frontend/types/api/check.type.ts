import type { TPagination } from "../others/index.type";
export interface checkType {
    id: number,
    clientId: number,
    create_at: string,
    update_at: string,
    totalPrice: string,
    isPaid: boolean,
    status:string,
    part_pay_price:partPayment[]
}
export interface TCheck {
    items?:number,
    data?:checkType[]
    pagination?:TPagination
}

export interface ReplacePaymentType  {
    price?:number,
    reason:string
}

export interface partPayment {
    create_at: string,
    price: number
}