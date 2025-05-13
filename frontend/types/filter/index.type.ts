export interface TFCheck {
    id:number|null,
    _per_page:number,
    _page:number
}
export interface TFilterRoom {
    name:string,
    _limit:number,
    _page:number
    buildingId?:number|undefined,
    _expand:string
    
}