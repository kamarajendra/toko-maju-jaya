"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export function Header() {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm no-print">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg text-emerald-700"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
            />
          </svg>
          Toko Maju Jaya
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              !isAdmin
                ? "bg-emerald-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Kasir
          </Link>
          <Link
            href="/admin"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isAdmin
                ? "bg-emerald-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Admin
          </Link>

          {isAdmin && (
            <>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="ml-2 rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
                aria-label="Menu"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  {menuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  )}
                </svg>
              </button>

              <div className="hidden items-center gap-1 md:flex">
                <AdminNavLink href="/admin" current={pathname}>
                  Dashboard
                </AdminNavLink>
                <AdminNavLink href="/admin/produk" current={pathname}>
                  Produk
                </AdminNavLink>
                <AdminNavLink href="/admin/transaksi" current={pathname}>
                  Transaksi
                </AdminNavLink>
              </div>
            </>
          )}
        </nav>
      </div>

      {isAdmin && menuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-2 md:hidden">
          <div className="flex flex-col gap-1">
            <MobileNavLink
              href="/admin"
              current={pathname}
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </MobileNavLink>
            <MobileNavLink
              href="/admin/produk"
              current={pathname}
              onClick={() => setMenuOpen(false)}
            >
              Produk
            </MobileNavLink>
            <MobileNavLink
              href="/admin/transaksi"
              current={pathname}
              onClick={() => setMenuOpen(false)}
            >
              Transaksi
            </MobileNavLink>
          </div>
        </div>
      )}
    </header>
  )
}

function AdminNavLink({
  href,
  current,
  children,
}: {
  href: string
  current: string
  children: React.ReactNode
}) {
  const active = current === href
  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </Link>
  )
}

function MobileNavLink({
  href,
  current,
  onClick,
  children,
}: {
  href: string
  current: string
  onClick: () => void
  children: React.ReactNode
}) {
  const active = current === href
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block rounded-lg px-3 py-2 text-sm font-medium ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </Link>
  )
}
