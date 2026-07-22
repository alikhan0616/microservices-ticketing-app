"use client";
import { useState } from "react";
import useRequest from "../../../../hooks/use-request";
import { useRouter } from "next/navigation";

export default function Ticket() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: { title, price },
    onSuccess: () => {
      router.push("/");
    },
  });

  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  };

  return (
    <div className="card form-card mt-6">
      <div className="card__body">
        <span className="eyebrow">New listing</span>
        <h1 className="page-title" style={{ fontSize: 26, marginTop: 6 }}>
          Create a ticket
        </h1>
        <p className="muted" style={{ fontSize: 14 }}>
          Give it a clear title and a fair price.
        </p>

        <form onSubmit={onSubmit} className="mt-4">
          <div className="field">
            <label className="field__label" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              className="input"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Front row — Coldplay"
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="price">
              Price (USD)
            </label>
            <input
              onBlur={onBlur}
              type="text"
              className="input"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
            />
          </div>
          {errors}
          <button className="btn btn--primary btn--block mt-2">
            Publish ticket
          </button>
        </form>
      </div>
    </div>
  );
}
