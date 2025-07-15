import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RoleService {
    constructor(
        @InjectModel(Role.name)
    )
}
