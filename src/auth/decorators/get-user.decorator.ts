import { ExecutionContext, createParamDecorator, InternalServerErrorException } from '@nestjs/common';

export const GetUser = createParamDecorator(
    (data, cxt: ExecutionContext)=>{
        const req = cxt.switchToHttp().getRequest();

        const user = data ? req.user[data] : req.user;

        if(!user){
            throw new InternalServerErrorException('User not found (request)')
        }

        return user; 
    }
);