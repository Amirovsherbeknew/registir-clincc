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

export interface TFilterRegister {
    gender:string,
    phone:string,
    doctorId?:number
    dateRange:string[]
    last_name:string,
    _page:number,
    _limit:number,
    visitTypes_like?:string
}

export interface TFilterCheck {
    dateRange:string[]
    _page:number,
    _limit:number,
    _order?:string,
    isPaid?:boolean,
    _sort?:string,
    visitTypes_like?:string
    status?:string
}

export interface TFilterReplacePayment {
    name:string,
    _limit:number,
    _page:number
    isPaid?:boolean,
    _order?:string,
    _sort?:string,
    id?:number,
    phone:string,
    dateRange:string[]
    _expand:string,
    status?:string
}