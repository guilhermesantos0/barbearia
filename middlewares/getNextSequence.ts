import Counter from "../models/Counter";

/**
 * 
 * @param sequenceName nome da sequência <'role' | 'premium'>
 */

export const getNextSequence = async (sequenceName: string): Promise<number> => {
    const updated = await Counter.findByIdAndUpdate(
        sequenceName, 
        { $inc: { seq: 1 }},
        { new: true, upsert: true }
    )

    return updated.seq;
}