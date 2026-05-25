"use client"

import type { Product } from "@/types"
import { useCart } from "./cart-provider"
import { formatRupiah } from "@/lib/utils"

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-1 flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 leading-tight">
          {product.name}
        </h3>
        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
          {product.category}
        </span>
      </div>
      <p className="mb-3 text-lg font-bold text-emerald-700">
        {formatRupiah(product.price)}
      </p>
      <button
        onClick={() => addItem(product)}
        className="mt-auto flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 text-base font-semibold text-white transition-colors active:bg-emerald-700 hover:bg-emerald-500 touch-manipulation"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        Tambah
      </button>
    </div>
  )
}
