import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import buildClient from "../../api/build-client";
import { CurrentUserProvider } from "../context/current-user-context";
import "./globals.css";
import Header from "../../components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ticketing",
  description: "Ticketing client app",
};

export default async function RootLayout({ children }) {
  const requestHeaders = await headers();
  let data = null;

  try {
    const client = buildClient({ headers: requestHeaders });
    const response = await client.get("/api/users/currentuser");
    data = response.data;
  } catch (error) {
    console.error("Server-side fetch failed:", error);
  }

  const currentUser = data?.currentUser;

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <CurrentUserProvider currentUser={currentUser}>
          <div className="app-shell">
            <Header />
            <main className="page">
              <div className="container">{children}</div>
            </main>
            <footer className="site-footer">
              <div className="container site-footer__inner">
                <span>© {new Date().getFullYear()} MicroTix</span>
                <span>Buy and sell event tickets.</span>
              </div>
            </footer>
          </div>
        </CurrentUserProvider>
      </body>
    </html>
  );
}
