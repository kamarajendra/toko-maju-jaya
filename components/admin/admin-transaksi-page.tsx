"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { Transaction } from "@/types"
import { TransactionTable } from "./transaction-table"
import { ReceiptDetailModal } from "./receipt-detail-modal"

export function AdminTransaksiPage({
  transactions,
  currentDate,
}: {
  transactions: Transaction[]
  currentDate: string
}) {
  const router = useRouter()
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
  const [dateValue, setDateValue] = useState(currentDate)

  const handleFilter = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const params = new URLSearchParams()
      if (dateValue) params.set("date", dateValue)
      router.push(`/admin/transaksi?${params.toString()}`)
    },
    [dateValue, router]
  )

  const handleReset = useCallback(() => {
    setDateValue("")
    router.push("/admin/transaksi")
  }, [router])

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Riwayat Transaksi
        </h1>
        <form
          onSubmit={handleFilter}
          className="flex items-center gap-2"
        >
          <input
            type="date"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
          <button
            type="submit"
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors active:bg-emerald-700 touch-manipulation"
          >
            Filter
          </button>
          {currentDate && (
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 touch-manipulation"
            >
              Reset
            </button>
          )}
        </form>
      </div>

      <TransactionTable
        transactions={transactions}
        onSelect={setSelectedTx}
      />

      {selectedTx && (
        <ReceiptDetailModal
          transactionId={selectedTx.id}
          onClose={() => setSelectedTx(null)}
        />
      )}
    </div>
  )
}
