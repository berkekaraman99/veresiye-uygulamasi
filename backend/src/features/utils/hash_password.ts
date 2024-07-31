import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  const saltRounds = 10;

  try {
    let x;
    const hashedPassword = await bcrypt
      .genSalt(saltRounds)
      .then((salt: any) => {
        x = bcrypt.hash(password, salt);
      })
      .then((hash: any) => {
        console.log("Hash: ", hash);
      })
      .catch((err: any) => console.log(err.message));
    console.log("x, ", x);
    return x;
  } catch (error: any) {
    throw new Error("Hash hatası: " + error.message);
  }
};

export const comparePassword = async (password: string, hashedPassword: string) => {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error: any) {
    throw new Error("Şifre karşılaştırma hatası: " + error.message);
  }
};
