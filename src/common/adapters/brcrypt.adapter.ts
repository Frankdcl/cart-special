import { compareSync, genSalt, genSaltSync, hashSync } from "bcrypt";


export class BcryptAdapter{
    hash ( password: string ) {
        const salt = genSaltSync();

        return hashSync( password, salt);
    }

    compare ( password: string, hashed: string ) {
        return compareSync( password, hashed );
    }
}