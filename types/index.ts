export interface Product {
  id: string
  name: string
  price: number
  category: string
  created_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Transaction {
  id: string
  transaction_number: string
  total_amount: number
  paid_amount: number
  change_amount: number
  created_at: string
}

export interface TransactionItem {
  id: string
  transaction_id: string
  product_id: string
  quantity: number
  price_at_sale: number
}

export interface DailySummary {
  total_penjualan: number
  jumlah_transaksi: number
  rata_rata_transaksi: number
  produk_terlaris: { name: string; total_qty: number } | null
}
