import { ResponseStatus } from "../constants/response_status_enum";

export default class UnauthorizedException extends Error {
  statusCode: number;

  constructor(message: any) {
    super(message);
    this.message = message ?? "Unauthorized";
    this.statusCode = ResponseStatus.UNAUTHORIZED;
  }
}
