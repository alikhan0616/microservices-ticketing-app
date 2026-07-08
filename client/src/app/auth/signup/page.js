"use client";

import { useState } from "react";
import useRequest from "../../../../hooks/use-request";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { doRequest, errors } = useRequest({
    url: `/api/users/signup`,
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    doRequest();
  };
  return (
    <form onSubmit={onSubmit}>
      <h1>Sign Up</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="form-control"
        />
      </div>
      {errors}
      <button type="submit" className="btn btn-primary">
        Sign Up
      </button>
    </form>
  );
}
