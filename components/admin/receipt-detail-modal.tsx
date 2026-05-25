"use client"

import { useEffect, useState } from "react"
import type { Product } from "@/types"
import { formatRupiah, formatDate } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

export function ReceiptDetailModal({
  transactionId,
  onClose,
}: {
  transactionId: string
  onClose: () => void
}) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{
    transaction: {
      transaction_number: string
      total_amount: number
      paid_amount: number
      change_amount: number
      created_at: string
    }
    items: {
      name: string
      quantity: number
      price_at_sale: number
    }[]
  } | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchDetail() {
      const { data: transaction, error: txError } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", transactionId)
        .single()

      if (txError || !transaction) {
        setError("Gagal memuat transaksi")
        setLoading(false)
        return
      }

      const { data: items, error: tiError } = await supabase
        .from("transaction_items")
        .select("product_id, quantity, price_at_sale")
        .eq("transaction_id", transactionId)

      if (tiError) {
        setError("Gagal memuat detail transaksi")
        setLoading(false)
        return
      }

      const productIds = items.map((i) => i.product_id)
      const { data: products } = await supabase
        .from("products")
        .select("id, name")
        .in("id", productIds)

      const productMap = new Map(
        (products ?? []).map((p) => [p.id, p.name])
      )

      setData({
        transaction: {
          transaction_number: transaction.transaction_number,
          total_amount: transaction.total_amount,
          paid_amount: transaction.paid_amount,
          change_amount: transaction.change_amount,
          created_at: transaction.created_at,
        },
        items: items.map((i) => ({
          name: productMap.get(i.product_id) ?? "Produk tidak ditemukan",
          quantity: i.quantity,
          price_at_sale: i.price_at_sale,
        })),
      })
      setLoading(false)
    }

    fetchDetail()
  }, [transactionId])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90dvh] w-full max-w-md flex-col rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">
            Detail Transaksi
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Tutup"
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

        <div className="overflow-y-auto p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <svg
                className="h-6 w-6 animate-spin text-emerald-600"
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
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {data && (
            <>
              <div className="mb-4 border-b border-dashed border-gray-200 pb-4 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>No. Transaksi</span>
                  <span className="font-medium text-gray-900">
                    {data.transaction.transaction_number}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tanggal</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(data.transaction.created_at)}
                  </span>
                </div>
              </div>

              <table className="mb-4 w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="pb-2 font-medium">Item</th>
                    <th className="pb-2 text-right font-medium">Qty</th>
                    <th className="pb-2 text-right font-medium">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item, i) => (
                    <tr key={i}>
                      <td className="py-1 text-gray-900">{item.name}</td>
                      <td className="py-1 text-right text-gray-600">
                        {item.quantity}
                      </td>
                      <td className="py-1 text-right font-medium text-gray-900">
                        {formatRupiah(item.price_at_sale * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t border-dashed border-gray-200 pt-4">
                <div className="flex justify-between text-base">
                  <span className="font-medium text-gray-600">Total</span>
                  <span className="font-bold text-gray-900">
                    {formatRupiah(data.transaction.total_amount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tunai</span>
                  <span className="font-medium text-gray-900">
                    {formatRupiah(data.transaction.paid_amount)}
                  </span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="font-medium text-gray-600">Kembalian</span>
                  <span className="font-bold text-blue-600">
                    {formatRupiah(data.transaction.change_amount)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
