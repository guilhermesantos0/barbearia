export interface IBenefit {
    _id: string,
    position: number,
    key: string,
    label: string,
    type: string,
    unlimited: boolean,
    value: number,
    conditions: Object
}

export interface IPlan {
    _id: string,
    position: number,
    name: string,
    description: string,
    price: number,
    active: boolean,
    benefits: IBenefit[]
}