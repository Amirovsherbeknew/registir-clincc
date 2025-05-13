import type { TBuildings } from "./buildings.type"

export interface TReplacePayment {
    create_at: string,
    update_at: string,
    reason: string,
    price: number
}
export interface rooms {
    id?: string,
    name: string,
    pricePerDay: number,
    create_at?:string,
    update_at?:string,
    people_per_room?:number,
    isPaid?:boolean,
    buildingId?:number,
    building?:TBuildings
    replace_payment?:TReplacePayment
}