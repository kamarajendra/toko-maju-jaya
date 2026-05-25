"use server"

import { supabaseAdmin } from "./supabase-admin"
import { revalidatePath } from "next/cache"
import type { CartItem, Product } from "@/types"

export async function createTransaction(items: CartItem[], paidAmount: number) {
  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  if (paidAmount < totalAmount) {
    return { error: "Uang tunai kurang dari total belanja" }
  }

  const { data: txNumber } = await supabaseAdmin.rpc("generate_tx_number")
  if (!txNumber) return { error: "Gagal generate nomor transaksi" }

  const transactionNumber = txNumber as string
  const changeAmount = paidAmount - totalAmount

  const { data: transaction, error: txError } = await supabaseAdmin
    .from("transactions")
    .insert({
      transaction_number: transactionNumber,
      total_amount: totalAmount,
      paid_amount: paidAmount,
      change_amount: changeAmount,
    })
    .select()
    .single()

  if (txError) return { error: txError.message }

  const txItems = items.map((item) => ({
    transaction_id: transaction.id,
    product_id: item.product.id,
    quantity: item.quantity,
    price_at_sale: item.product.price,
  }))

  const { error: tiError } = await supabaseAdmin
    .from("transaction_items")
    .insert(txItems)

  if (tiError) return { error: tiError.message }

  revalidatePath("/")
  revalidatePath("/admin")
  revalidatePath("/admin/transaksi")

  return {
    data: {
      transaction_number: transactionNumber,
      total_amount: totalAmount,
      paid_amount: paidAmount,
      change_amount: changeAmount,
      created_at: transaction.created_at,
      items,
    },
  }
}

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string
  const price = parseInt(formData.get("price") as string, 10)
  const category = (formData.get("category") as string) || "Umum"

  if (!name || isNaN(price)) {
    return { error: "Nama dan harga harus diisi" }
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .insert({ name, price, category })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath("/admin/produk")
  return { data }
}

export async function updateProduct(formData: FormData) {
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const price = parseInt(formData.get("price") as string, 10)
  const category = (formData.get("category") as string) || "Umum"

  if (!id || !name || isNaN(price)) {
    return { error: "Data tidak lengkap" }
  }

  const { error } = await supabaseAdmin
    .from("products")
    .update({ name, price, category })
    .eq("id", id)

  if (error) return { error: error.message }

  revalidatePath("/admin/produk")
  return { success: true }
}

export async function deleteProduct(id: string) {
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id)

  if (error) return { error: error.message }

  revalidatePath("/admin/produk")
  return { success: true }
}

export async function getDailySummary() {
  const today = new Date()
  const startOfDay = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}T00:00:00+08:00`
  const endOfDay = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}T23:59:59+08:00`

  const { data: transactions } = await supabaseAdmin
    .from("transactions")
    .select("*")
    .gte("created_at", startOfDay)
    .lte("created_at", endOfDay)

  const totalPenjualan = transactions?.reduce((s, t) => s + t.total_amount, 0) ?? 0
  const jumlahTransaksi = transactions?.length ?? 0
  const rataRata = jumlahTransaksi > 0 ? Math.round(totalPenjualan / jumlahTransaksi) : 0

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
        productQty[item.product_id] = (productQty[item.product_id] ?? 0) + item.quantity
      }

      const topProductId = Object.entries(productQty).sort((a, b) => b[1] - a[1])[0]?.[0]

      if (topProductId) {
        const { data: product } = await supabaseAdmin
          .from("products")
          .select("name")
          .eq("id", topProductId)
          .single()

        if (product) {
          produkTerlaris = { name: product.name, total_qty: productQty[topProductId] }
        }
      }
    }
  }

  revalidatePath("/admin")
  return {
    total_penjualan: totalPenjualan,
    jumlah_transaksi: jumlahTransaksi,
    rata_rata_transaksi: rataRata,
    produk_terlaris: produkTerlaris,
  }
}
