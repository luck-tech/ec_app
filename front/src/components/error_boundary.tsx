import {JSX, useEffect} from "react";
import {Navigate, useRouteError} from "react-router-dom";
import {useQueryErrorResetBoundary} from "@tanstack/react-query";
import {HttpResponseError} from "@/lib/error";

export function ErrorBoundary(): JSX.Element {
  // reset error for unmounted component
  // @see https://github.com/TanStack/query/issues/2712
  // @see https://codesandbox.io/p/sandbox/naughty-nash-7jixq?file=%2Fsrc%2FApp.tsx
  const {reset} = useQueryErrorResetBoundary();
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const error = useRouteError();
  if (error instanceof HttpResponseError) {
    if (error.status === 401) {
      return <Navigate to="/login" replace />;
    } else {
      return <div>Request failed. message: {error.message}</div>;
    }
  }

  return <div>Unexpected error occurred</div>;
}
