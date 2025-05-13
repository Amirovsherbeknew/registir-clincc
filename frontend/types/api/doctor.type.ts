import type { TPagination } from "../others/index.type";
export interface doctors {
    id?: number;
    last_name: string;
    first_name: string;
    middle_name: string;
    position: string;
    clients?: string[];
    category: string[];
    create_at?:string,
    update_at?:string,
}
export interface TDoctorsListApi {
    items?:number,
    data?:doctors[],
    pagination?:TPagination
}