import { supabaseAdmin } from "@/lib/supabase-admin"
import type { Transaction } from "@/types"
import { AdminTransaksiPage } from "@/components/admin/admin-transaksi-page"

export const dynamic = "force-dynamic"

export default async function TransaksiPage(props: {
  searchParams?: Promise<{ date?: string }>
}) {
  const searchParams = await props.searchParams
  const dateFilter = searchParams?.date

  let query = supabaseAdmin
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100)

  if (dateFilter) {
    const startOfDay = `${dateFilter}T00:00:00+08:00`
    const endOfDay = `${dateFilter}T23:59:59+08:00`
    query = query.gte("created_at", startOfDay).lte("created_at", endOfDay)
  }

  const { data: transactions } = await query

  return (
    <AdminTransaksiPage
      transactions={(transactions as Transaction[]) ?? []}
      currentDate={dateFilter ?? ""}
    />
  )
}
