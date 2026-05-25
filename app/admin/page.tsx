import { supabaseAdmin } from "@/lib/supabase-admin"
import { SummaryCards } from "@/components/admin/summary-cards"
import type { DailySummary } from "@/types"

export const dynamic = "force-dynamic"

async function getDailySummaryData(): Promise<DailySummary> {
  const today = new Date()
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, "0")
  const d = String(today.getDate()).padStart(2, "0")
  const startOfDay = `${y}-${m}-${d}T00:00:00+08:00`
  const endOfDay = `${y}-${m}-${d}T23:59:59+08:00`

  const { data: transactions } = await supabaseAdmin
    .from("transactions")
    .select("*")
    .gte("created_at", startOfDay)
    .lte("created_at", endOfDay)

  const totalPenjualan =
    transactions?.reduce((s, t) => s + t.total_amount, 0) ?? 0
  const jumlahTransaksi = transactions?.length ?? 0
  const rataRataTransaksi =
    jumlahTransaksi > 0 ? Math.round(totalPenjualan / jumlahTransaksi) : 0

  let produkTerlaris: { name: string; total_qty: number } | null = null

  if (jumlahTransaksi > 0) {
    const txIds = transactions!.map((t) => t.id)
    const { data: items } = await supabaseAdmin
      .from("transaction_items")
      .select("product_id, quantity")
      .in("transaction_id", txIds)

    if (items && items.length > 0) {
      const productQty: Record<string, number> = {}
      for (const item of items) {
        productQty[item.product_id] =
          (productQty[item.product_id] ?? 0) + item.quantity
      }
      const topId = Object.entries(productQty).sort((a, b) => b[1] - a[1])[0]?.[0]
      if (topId) {
        const { data: product } = await supabaseAdmin
          .from("products")
          .select("name")
          .eq("id", topId)
          .single()
        if (product) {
          produkTerlaris = { name: product.name, total_qty: productQty[topId] }
        }
      }
    }
  }

  return { total_penjualan: totalPenjualan, jumlah_transaksi: jumlahTransaksi, rata_rata_transaksi: rataRataTransaksi, produk_terlaris: produkTerlaris }
}

export default async function AdminDashboard() {
  const summary = await getDailySummaryData()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Dashboard Admin
      </h1>
      <SummaryCards summary={summary} />
    </div>
  )
}
