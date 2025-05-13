import type { TPagination } from "../others/index.type";
export interface medServices {
    id: string,
    name: string,
    price: number,
    create_at:string,
    update_at:string
}
export interface TMedServices {
    item?:number,
    data?:medServices[],
    pagination?:TPagination
}