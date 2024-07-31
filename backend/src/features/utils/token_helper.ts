import JWT, { JwtPayload, Secret } from "jsonwebtoken";
import randomString from "randomstring";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY: Secret = `${process.env.JWT_SECRET_KEY}`;

const ACCESS_TOKEN_EXPIRATION = 60 * 60 * 24 * 30; // 1 month
const REFRESH_TOKEN_EXPIRATION = 60 * 60 * 24 * 30 * 2; // 2 months

export const generateToken = (payload: any) => {
  const accessToken = JWT.sign({ id: payload.id }, SECRET_KEY, {
    expiresIn: ACCESS_TOKEN_EXPIRATION,
  });
  return {
    accessToken: accessToken,
    expiration: new Date(Date.now() + ACCESS_TOKEN_EXPIRATION * 1000),
    refreshToken: "",
  };
};

export const decodeToken = (payload: any) => {
  const decodedToken: JwtPayload | string = JWT.verify(payload, SECRET_KEY);

  return decodedToken;
};

export const verifyToken = (token: any) => {
  return JWT.verify(token, SECRET_KEY);
};

export const generateResetPasswordToken = () => {
  return randomString.generate({
    length: 40,
    charset: "alphanumeric",
  });
};
