import bcrypt from 'bcrypt'

export class BcryptUtil {
    static async hashPassword(password: string, saltsRounds: number = 10){
        return await bcrypt.hash(password, saltsRounds)
    }

    static async comparePassword(plainPassword: string, hashedPassword: string){
        return await bcrypt.compare(plainPassword, hashedPassword)
    }
}