"use client"

import type { Product } from "@/types"
import { ProductGrid } from "./product-grid"
import { CartSidebar } from "./cart-sidebar"

export function KasirPage({ products }: { products: Product[] }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
      <div className="flex-1 px-4 py-4 sm:px-6">
        <ProductGrid products={products} />
      </div>
      <CartSidebar />
    </div>
  )
}
