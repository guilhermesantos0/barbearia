interface Benefit {
    position: number,
    description: string
}

export interface Premium {
    _id: number,
    position: number,
    name: string,
    description: string,
    price: string,
    benefits: Benefit[]
}