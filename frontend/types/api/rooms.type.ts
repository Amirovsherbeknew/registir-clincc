import type { TBuildings } from "./buildings.type"
export interface rooms {
    id?: string,
    name: string,
    pricePerDay: number,
    create_at?:string,
    update_at?:string,
    people_per_room?:number,
    buildingId?:number,
    building?:TBuildings
}