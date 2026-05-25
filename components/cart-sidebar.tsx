"use client"

import { useState, useCallback } from "react"
import { useCart } from "./cart-provider"
import { formatRupiah } from "@/lib/utils"
import { createTransaction } from "@/lib/actions"
import { ReceiptModal } from "./receipt-modal"

export function CartSidebar() {
  const { items, updateQuantity, removeItem, grandTotal, clearCart } = useCart()
  const [cashInput, setCashInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [receipt, setReceipt] = useState<{
    transaction_number: string
    total_amount: number
    paid_amount: number
    change_amount: number
    created_at: string
    items: typeof items
  } | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const cashAmount = parseInt(cashInput.replace(/[^0-9]/g, "") || "0", 10)
  const changeAmount = cashAmount >= grandTotal ? cashAmount - grandTotal : 0

  const handleCashInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, "")
      setCashInput(raw)
      setError("")
    },
    []
  )

  const handlePay = async () => {
    if (items.length === 0) {
      setError("Keranjang masih kosong")
      return
    }
    if (cashAmount < grandTotal) {
      setError("Uang tunai kurang dari total belanja")
      return
    }

    setLoading(true)
    setError("")

    const result = await createTransaction(items, cashAmount)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    setReceipt({
      ...result.data!,
      items,
    })
    setIsOpen(true)
    setLoading(false)
  }

  const handleNewTransaction = () => {
    clearCart()
    setCashInput("")
    setReceipt(null)
    setIsOpen(false)
    setError("")
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg md:hidden"
        aria-label="Buka keranjang"
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
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
          />
        </svg>
        {items.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {items.reduce((s, i) => s + i.quantity, 0)}
          </span>
        )}
      </button>

      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-white shadow-xl transition-transform duration-300 sm:w-96 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:sticky md:top-14 md:z-auto md:flex md:h-[calc(100dvh-3.5rem)] md:translate-x-0 md:border-l md:border-gray-200`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="text-lg font-bold text-gray-900">Keranjang</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden"
            aria-label="Tutup keranjang"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <svg
                className="mb-3 h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              <p className="text-lg font-medium">Keranjang kosong</p>
              <p className="text-sm">Tambahkan produk dari daftar</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <li
                  key={item.product.id}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 p-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-gray-900">
                      {item.product.name}
                    </p>
                    <p className="text-sm font-semibold text-emerald-700">
                      {formatRupiah(item.product.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.quantity - 1
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 touch-manipulation"
                      aria-label="Kurangi"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14"
                        />
                      </svg>
                    </button>
                    <span className="flex h-9 w-9 items-center justify-center text-base font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.quantity + 1
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 touch-manipulation"
                      aria-label="Tambah"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="w-20 text-right text-sm font-semibold text-gray-900">
                    {formatRupiah(item.product.price * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 touch-manipulation"
                    aria-label="Hapus"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-base font-medium text-gray-600">
                Grand Total
              </span>
              <span className="text-xl font-bold text-emerald-700">
                {formatRupiah(grandTotal)}
              </span>
            </div>

            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Uang Tunai
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  Rp
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={cashInput}
                  onChange={handleCashInput}
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-lg font-semibold transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </div>

            {cashAmount > 0 && changeAmount >= 0 && (
              <div className="mb-3 flex items-center justify-between">
                <span className="text-base font-medium text-gray-600">
                  Kembalian
                </span>
                <span className="text-xl font-bold text-blue-600">
                  {formatRupiah(changeAmount)}
                </span>
              </div>
            )}

            {error && (
              <div className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={loading}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-lg font-bold text-white shadow-lg transition-colors active:bg-emerald-700 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation"
            >
              {loading ? (
                <svg
                  className="h-5 w-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                <>
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
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                  Bayar
                </>
              )}
            </button>
          </div>
        )}
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {receipt && (
        <ReceiptModal
          receipt={receipt}
          onClose={handleNewTransaction}
        />
      )}
    </>
  )
}
