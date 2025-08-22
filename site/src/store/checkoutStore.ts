import { create } from 'zustand';

interface ProductData {
    duration?: string,
    date?: string,
    time?: string
}

interface Product {
    name?: string,
    data?: ProductData
}

interface CheckoutState {
    price?: number,
    product?: Product,
    discount?: number,
    type?: string,
    setCheckout: (checkout: CheckoutState) => void;
    clearCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
    price: undefined,
    product: undefined,
    discount: undefined,
    type: undefined,
    setCheckout: (checkout) => set(checkout),
    clearCheckout: () => set({
        price: undefined,
        product: undefined,
        discount: undefined,
        type: undefined
    })
}));