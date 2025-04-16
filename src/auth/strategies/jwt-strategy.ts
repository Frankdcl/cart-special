import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "../interfaces/jwt-payload.interface";



@Injectable()
export class JwtStrategy extends PassportStrategy ( Strategy ) {
    
    constructor (
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService, 
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET')!,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { id, email } = payload;
      
        if (!id && !email) {
          throw new UnauthorizedException('Token not valid');
        }
      
        const user = await this.userRepository.findOne({
          where: id ? { id } : { email },
        });
      
        if (!user) {
          throw new UnauthorizedException('User not found');
        }
      
        return user;
      }

}