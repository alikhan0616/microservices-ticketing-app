"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useRequest from "../../../../hooks/use-request";

export default function SignOutPage() {
  const router = useRouter();
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
  });

  useEffect(() => {
    doRequest();
  }, [doRequest]);
  return <div>Signing out...</div>;
}
