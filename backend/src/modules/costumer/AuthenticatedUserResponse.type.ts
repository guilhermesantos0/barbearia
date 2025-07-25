import { Employee } from "../employee/schemas/employee.schema";
import { Costumer } from "./schemas/costumer.schema";

export type AuthenticatedUserResponse = {
    access_token: string | undefined;
    user: Partial<Costumer> | Partial<Employee> | null;
};