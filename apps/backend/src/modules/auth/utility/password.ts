import bcrypt from "bcryptjs";
class PasswordLibrary {
  public async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
  public async verifyPassword(
    normalPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    const comparision = await bcrypt.compare(normalPassword, hashedPassword);
    return comparision;
  }
}
export default new PasswordLibrary();
