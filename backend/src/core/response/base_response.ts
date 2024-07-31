export default class BaseResponse {
  data: any;
  isSuccess: boolean;
  statusCode: number;
  errors: any;

  constructor(data: any, isSuccess: boolean, statusCode: number, errors: any) {
    this.data = data;
    this.isSuccess = isSuccess;
    this.statusCode = statusCode;
    this.errors = errors;
  }

  static success(data: any, statusCode = 200) {
    return new BaseResponse(data, true, statusCode, null);
  }

  static fail(errors: any, statusCode = 500) {
    return new BaseResponse(null, false, statusCode, errors);
  }
}
