"use client"

import type { DailySummary } from "@/types"
import { formatRupiah } from "@/lib/utils"

export function SummaryCards({
  summary,
}: {
  summary: DailySummary
}) {
  const cards = [
    {
      title: "Total Penjualan",
      value: formatRupiah(summary.total_penjualan),
      icon: "💰",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      title: "Jumlah Transaksi",
      value: summary.jumlah_transaksi.toString(),
      icon: "📋",
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      title: "Rata-rata Transaksi",
      value: formatRupiah(summary.rata_rata_transaksi),
      icon: "📊",
      color: "bg-teal-50 text-teal-700 border-teal-200",
    },
    {
      title: "Produk Terlaris",
      value: summary.produk_terlaris
        ? `${summary.produk_terlaris.name} (${summary.produk_terlaris.total_qty})`
        : "-",
      icon: "🏆",
      color: "bg-amber-50 text-amber-700 border-amber-200",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`rounded-xl border-2 p-5 ${card.color}`}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold uppercase tracking-wide opacity-80">
              {card.title}
            </span>
            <span className="text-2xl">{card.icon}</span>
          </div>
          <p className="text-2xl font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  )
}
