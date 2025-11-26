import bcrypt from "bcrypt"

class BcryptService {
  private static saltRounds = 10

  public static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds)
  }

  public static async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }
}

export default BcryptService
