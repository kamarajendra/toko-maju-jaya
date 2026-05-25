"use client"

import { useState } from "react"
import { createProduct, updateProduct } from "@/lib/actions"

type Mode = "tambah" | "edit"

type Props = {
  mode: Mode
  defaultValues?: { id: string; name: string; price: number; category: string }
  onClose: () => void
}

export function ProductForm({ mode, defaultValues, onClose }: Props) {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)

    if (mode === "edit" && defaultValues) {
      formData.set("id", defaultValues.id)
      const result = await updateProduct(formData)
      if (result.error) {
        setError(result.error)
        setLoading(false)
        return
      }
    } else {
      const result = await createProduct(formData)
      if (result.error) {
        setError(result.error)
        setLoading(false)
        return
      }
    }

    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {mode === "tambah" ? "Tambah Produk" : "Edit Produk"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Tutup"
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
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nama Produk
            </label>
            <input
              name="name"
              type="text"
              required
              defaultValue={defaultValues?.name ?? ""}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="Masukkan nama produk"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Harga (Rp)
            </label>
            <input
              name="price"
              type="number"
              required
              min={0}
              defaultValue={defaultValues?.price ?? ""}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="Masukkan harga"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Kategori
            </label>
            <input
              name="category"
              type="text"
              defaultValue={defaultValues?.category ?? "Umum"}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="Nama kategori"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex h-12 flex-1 items-center justify-center rounded-xl border-2 border-gray-300 font-semibold text-gray-700 transition-colors active:bg-gray-50 touch-manipulation"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex h-12 flex-1 items-center justify-center rounded-xl bg-emerald-600 font-semibold text-white shadow-sm transition-colors active:bg-emerald-700 disabled:opacity-50 touch-manipulation"
            >
              {loading
                ? "Menyimpan..."
                : mode === "tambah"
                  ? "Simpan"
                  : "Perbarui"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
