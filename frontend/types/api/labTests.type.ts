import type { TPagination } from "../others/index.type";
export interface labTests {
    id: string,
    name: string,
    price: number,
    create_at:string,
    update_at:string
}
export interface TLabTest {
    item?:number,
    data?:labTests[],
    pagination?:TPagination
}