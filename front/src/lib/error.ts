export const throwResponseError = async (res: Response): Promise<never> => {
  const json = await res.json();
  if (res.status === 422) {
    throw new ValidationError(json.message, json.errors);
  } else {
    throw new HttpResponseError(json.message, res.status);
  }
};

export class HttpResponseError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "HttpResponseError";
    this.status = status;
  }
}

export class ValidationError extends HttpResponseError {
  readonly errors: string[];
  constructor(message: string, errors: string[]) {
    super(message, 422);
    this.name = "ValidationError";
    this.errors = errors;
  }
}
