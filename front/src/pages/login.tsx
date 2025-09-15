import {JSX, useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {login} from "@/api/auth";
import {HttpResponseError, ValidationError} from "@/lib/error";

export function LoginPage(): JSX.Element {
  const [errors, setErrors] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      location.href = "/";
    },
    onError: error => {
      if (error instanceof ValidationError) {
        setErrors(error.errors);
      } else if (error instanceof HttpResponseError) {
        setErrors([error.message]);
      } else {
        console.error(error);
        setErrors(["Unexpected error occurred"]);
      }
    },
  });

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    mutation.mutate({email, password});
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col w-96 m-auto gap-y-8"
      >
        <div className="flex flex-col">
          <label htmlFor="email" className="text-lg">
            Email
          </label>
          <input
            id="email"
            type="email"
            data-test="email"
            onChange={event => {
              setEmail(event.target.value);
            }}
            className="border p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            data-test="password"
            onChange={event => {
              setPassword(event.target.value);
            }}
            className="border p-2"
          />
        </div>
        {errors.length !== 0 ? (
          <ul>
            {errors.map(error => (
              <li key={error} className="text-orange-400">
                {error}
              </li>
            ))}
          </ul>
        ) : null}
        <button
          type="submit"
          data-test="submit"
          className="px-6 py-2 text-lg text-white rounded-lg bg-orange-400"
        >
          Login
        </button>
      </form>
    </div>
  );
}
