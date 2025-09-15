import { create } from 'zustand';

interface ScheduledServiceData {
    duration?: string,
    date?: string,
    time?: string,
    rawDateTime?: Date,
    id?: string,
    barber?: {
        name?: string,
        profilePic?: string,
        rate?: string,
        id?: string
    }
}

interface Product {
    name?: string,
    data?: ScheduledServiceData
}

interface CheckoutState {
    price?: number,
    product?: Product,
    discount?: number,
    type?: string,
    userId?: string,
    setCheckout: (checkout: CheckoutState) => void;
    clearCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
    price: undefined,
    product: undefined,
    discount: undefined,
    type: undefined,
    userId: undefined,
    setCheckout: (checkout) => set(() => ({
        price: undefined,
        product: undefined,
        discount: undefined,
        type: undefined,
        userId: undefined,
        ...checkout
    })),
    clearCheckout: () => set({
        price: undefined,
        product: undefined,
        discount: undefined,
        type: undefined,
        userId: undefined
    })
}));