interface Benefit {
    pos: number,
    description: string
}

export interface IPlan {
    _id: number,
    position: number,
    name: string,
    description: string,
    price: string,
    benefits: Benefit[]
}