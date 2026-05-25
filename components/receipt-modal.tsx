"use client"

import type { CartItem } from "@/types"
import { formatRupiah, formatDate } from "@/lib/utils"

export function ReceiptModal({
  receipt,
  onClose,
}: {
  receipt: {
    transaction_number: string
    total_amount: number
    paid_amount: number
    change_amount: number
    created_at: string
    items: CartItem[]
  }
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90dvh] w-full max-w-md flex-col rounded-2xl bg-white shadow-2xl">
        <div className="overflow-y-auto p-6" id="receipt-content">
          <div className="mb-4 text-center">
            <h2 className="text-xl font-bold text-gray-900">Toko Maju Jaya</h2>
            <p className="text-sm text-gray-500">Struk Pembayaran</p>
          </div>

          <div className="mb-4 border-t border-dashed border-gray-300 pt-4 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>No. Transaksi</span>
              <span className="font-medium text-gray-900">
                {receipt.transaction_number}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tanggal</span>
              <span className="font-medium text-gray-900">
                {formatDate(receipt.created_at)}
              </span>
            </div>
          </div>

          <div className="mb-4 border-t border-dashed border-gray-300 pt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="pb-2 font-medium">Item</th>
                  <th className="pb-2 text-right font-medium">Qty</th>
                  <th className="pb-2 text-right font-medium">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {receipt.items.map((item) => (
                  <tr key={item.product.id}>
                    <td className="py-1 text-gray-900">
                      {item.product.name}
                    </td>
                    <td className="py-1 text-right text-gray-600">
                      {item.quantity}
                    </td>
                    <td className="py-1 text-right font-medium text-gray-900">
                      {formatRupiah(
                        item.product.price * item.quantity
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-dashed border-gray-300 pt-4">
            <div className="flex justify-between text-base">
              <span className="font-medium text-gray-600">Total</span>
              <span className="font-bold text-gray-900">
                {formatRupiah(receipt.total_amount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tunai</span>
              <span className="font-medium text-gray-900">
                {formatRupiah(receipt.paid_amount)}
              </span>
            </div>
            <div className="flex justify-between text-base">
              <span className="font-medium text-gray-600">Kembalian</span>
              <span className="font-bold text-blue-600">
                {formatRupiah(receipt.change_amount)}
              </span>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-400">
            Terima kasih telah berbelanja
          </div>
        </div>

        <div className="flex gap-3 border-t border-gray-200 p-4 no-print">
          <button
            onClick={() => window.print()}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-emerald-600 font-semibold text-emerald-700 transition-colors active:bg-emerald-50 touch-manipulation"
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
                d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
              />
            </svg>
            Cetak Struk
          </button>
          <button
            onClick={onClose}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 font-semibold text-white shadow-sm transition-colors active:bg-emerald-700 touch-manipulation"
          >
            Transaksi Baru
          </button>
        </div>
      </div>
    </div>
  )
}
