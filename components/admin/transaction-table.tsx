"use client"

import type { Transaction } from "@/types"
import { formatRupiah, formatDate } from "@/lib/utils"

export function TransactionTable({
  transactions,
  onSelect,
}: {
  transactions: Transaction[]
  onSelect: (tx: Transaction) => void
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 font-semibold text-gray-600">
              No. Transaksi
            </th>
            <th className="px-4 py-3 font-semibold text-gray-600">Total</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Bayar</th>
            <th className="px-4 py-3 font-semibold text-gray-600">
              Kembalian
            </th>
            <th className="px-4 py-3 font-semibold text-gray-600">Waktu</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr
              key={tx.id}
              onClick={() => onSelect(tx)}
              className="cursor-pointer border-b border-gray-100 last:border-0 hover:bg-gray-50"
            >
              <td className="px-4 py-3 font-medium text-gray-900">
                {tx.transaction_number}
              </td>
              <td className="px-4 py-3 font-semibold text-emerald-700">
                {formatRupiah(tx.total_amount)}
              </td>
              <td className="px-4 py-3 text-gray-700">
                {formatRupiah(tx.paid_amount)}
              </td>
              <td className="px-4 py-3 text-blue-600">
                {formatRupiah(tx.change_amount)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {formatDate(tx.created_at)}
              </td>
            </tr>
          ))}
          {transactions.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-12 text-center text-gray-400"
              >
                Belum ada transaksi
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
