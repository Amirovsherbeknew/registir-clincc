import type { TPagination } from "../others/index.type";
export interface TBuildings {
    id?:number,
    create_at?:string,
    update_at?:string,
    name:string,
    per_room:1
}
export interface TBuildingsApi {
    item?:number,
    data?:TBuildings[],
    pagination?:TPagination
}