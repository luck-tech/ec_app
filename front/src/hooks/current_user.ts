import {useSuspenseQuery} from "@tanstack/react-query";
import {getCurrentUser} from "@/api/auth";
import {User} from "@/types";

export const useCurrentUser = (): {currentUser: User | undefined} => {
  const query = useSuspenseQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
  });
  return {
    currentUser: query.data.user,
  };
};
