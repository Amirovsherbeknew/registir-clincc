import type { TPagination } from "../others/index.type";
export interface checkType {
    id: number,
    clientId: number,
    create_at: string,
    update_at: string,
    totalPrice: string,
    isPaid: boolean
}
export interface TCheck {
    items?:number,
    data?:checkType[]
    pagination?:TPagination
}