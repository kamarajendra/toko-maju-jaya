import { supabaseAdmin } from "@/lib/supabase-admin"
import type { Product } from "@/types"
import { AdminProdukPage } from "@/components/admin/admin-produk-page"

export const dynamic = "force-dynamic"

export default async function ProdukPage() {
  const { data: products } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("name", { ascending: true })

  return <AdminProdukPage products={(products as Product[]) ?? []} />
}
