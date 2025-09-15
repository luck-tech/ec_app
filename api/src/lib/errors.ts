export class HttpClientError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors: string[] | undefined = undefined,
  ) {
    super(message);
    this.name = "HttpClientError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export class UnauthorizedError extends HttpClientError {
  constructor(message = "Unauthorized") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends HttpClientError {
  constructor(message = "Forbidden") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends HttpClientError {
  constructor(message = "Not Found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends HttpClientError {
  constructor(errors: string[], message = "Validation Failed") {
    super(message, 422, errors);
    this.name = "ValidationError";
  }
}
