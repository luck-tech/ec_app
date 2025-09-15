import bcrypt from "bcryptjs";

export class HashPassword {
  private readonly saltRounds: number;
  constructor() {
    this.saltRounds = 10;
  }

  async generate(plaintextPassword: string) {
    return bcrypt.hash(plaintextPassword, this.saltRounds);
  }

  async compare(plaintextPassword: string, hash: string) {
    return bcrypt.compare(plaintextPassword, hash);
  }
}
