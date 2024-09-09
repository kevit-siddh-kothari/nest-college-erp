import { IsNotEmpty, IsString } from "class-validator";

export class DepartmentValidator {
    @IsString()
    @IsNotEmpty()
    name: string;
};