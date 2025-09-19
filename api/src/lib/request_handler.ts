import {Request, Response, NextFunction, RequestHandler} from "express";

// 非同期関数を受け取り、Expressの標準的なリクエストハンドラを返す高階関数
export const asyncHandler =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    // Promise.resolve()でラップすることで、fnが同期/非同期どちらでも対応可能になる
    // .catch(next)で、Promiseがrejectされた(エラーがthrowされた)場合に自動的にnext(error)を呼ぶ
    Promise.resolve(fn(req, res, next)).catch(next);
  };
