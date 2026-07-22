"use client";

import { useState } from "react";
import useRequest from "../../../../hooks/use-request";
import Link from "next/link";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: `/api/users/signin`,
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => {
      // Hard navigation so the server layout re-runs and the header
      // reflects the newly logged-in state.
      window.location.href = "/";
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    doRequest();
  };

  return (
    <div className="card form-card mt-6">
      <div className="card__body">
        <span className="eyebrow">Welcome back</span>
        <h1 className="page-title" style={{ fontSize: 26, marginTop: 6 }}>
          Sign in
        </h1>

        <form onSubmit={onSubmit} className="mt-4">
          <div className="field">
            <label className="field__label">Email address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              type="email"
              placeholder="you@example.com"
            />
          </div>
          <div className="field">
            <label className="field__label">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="input"
              placeholder="••••••••"
            />
          </div>
          {errors}
          <button type="submit" className="btn btn--primary btn--block mt-2">
            Sign in
          </button>
        </form>

        <p className="muted mt-4" style={{ fontSize: 14, textAlign: "center" }}>
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" style={{ color: "var(--accent)", fontWeight: 550 }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
