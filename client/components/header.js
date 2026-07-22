"use client";
import { useCurrentUser } from "@/context/current-user-context";
import Link from "next/link";

export default function Header() {
  const currentUser = useCurrentUser();

  const links = currentUser
    ? [
        { label: "Sell Tickets", href: "/tickets/new" },
        { label: "My Orders", href: "/orders" },
        { label: "Sign Out", href: "/auth/signout" },
      ]
    : [
        { label: "Sign In", href: "/auth/signin" },
        { label: "Sign Up", href: "/auth/signup" },
      ];

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="brand">
          <span className="brand__mark">
            <span>◆</span>
          </span>
          MicroTix
        </Link>

        <nav className="nav">
          {links.map(({ label, href }) => (
            <Link key={href} href={href} className="nav__link">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
