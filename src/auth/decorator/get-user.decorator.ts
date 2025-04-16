import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";


export const GetUser = createParamDecorator(
    ( data: string, contex: ExecutionContext ) => {

        const req = contex.switchToHttp().getRequest();
        const user = req.user;

        if ( !user )
            throw new InternalServerErrorException('User not found (request)');

        return ( !data )
            ? user
            : user[data]
    }
)