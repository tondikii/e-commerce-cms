// hooks/useRequireAuth.ts

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import {STATUS_AUTHENTICATED} from "@/constant";

const useUnrequiredAuth = () => {
  const {status} = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === STATUS_AUTHENTICATED) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return null;
};

export default useUnrequiredAuth;
