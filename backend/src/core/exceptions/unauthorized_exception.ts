export default class UnauthorizedException extends Error {
  statusCode: number;

  constructor(message: any) {
    super(message);
    this.message = message ?? "Unauthorized";
    this.statusCode = 401;
  }
}
