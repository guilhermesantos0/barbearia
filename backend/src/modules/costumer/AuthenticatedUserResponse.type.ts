import { Costumer } from "./schemas/costumer.schema";

export type AuthenticatedUserResponse = {
    access_token: string | undefined;
    user: Costumer | null;
};