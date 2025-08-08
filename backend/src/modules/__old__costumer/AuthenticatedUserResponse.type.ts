import { User } from "../user/schemas/user.schema";

export type AuthenticatedUserResponse = {
    access_token: string | undefined;
    user: Partial<User> | null;
};