import axios from "axios";

export default function buildClient({ req, headers: requestHeaders } = {}) {
  if (typeof window === "undefined") {
    // We are on the server

    const headers =
      requestHeaders && typeof requestHeaders.entries === "function"
        ? Object.fromEntries(requestHeaders.entries())
        : (req?.headers ?? {});

    return axios.create({
      baseURL: "http://www.microtix.space/",
      headers,
    });
  } else {
    return axios.create({
      baseURL: "/",
    });
  }
}
