import { supabase } from "@/lib/supabase"
import type { Product } from "@/types"
import { KasirPage } from "@/components/kasir-page"

export const dynamic = "force-dynamic"

export default async function Home() {
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("name", { ascending: true })

  return <KasirPage products={(products as Product[]) ?? []} />
}
