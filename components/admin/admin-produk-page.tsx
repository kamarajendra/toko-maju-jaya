"use client"

import { useState } from "react"
import type { Product } from "@/types"
import { formatRupiah } from "@/lib/utils"
import { deleteProduct } from "@/lib/actions"
import { ProductForm } from "./product-form"

export function AdminProdukPage({
  products,
}: {
  products: Product[]
}) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete(id: string) {
    setDeleting(true)
    await deleteProduct(id)
    setDeleting(false)
    setDeleteId(null)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Produk</h1>
        <button
          onClick={() => {
            setEditing(null)
            setShowForm(true)
          }}
          className="flex h-12 items-center gap-2 rounded-xl bg-emerald-600 px-5 font-semibold text-white shadow-sm transition-colors active:bg-emerald-700 touch-manipulation"
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
          Tambah Produk
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 font-semibold text-gray-600">Nama</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Harga</th>
              <th className="px-4 py-3 font-semibold text-gray-600">
                Kategori
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
              >
                <td className="px-4 py-3 font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-4 py-3 font-semibold text-emerald-700">
                  {formatRupiah(product.price)}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                    {product.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditing(product)
                        setShowForm(true)
                      }}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 touch-manipulation"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(product.id)}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 touch-manipulation"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-12 text-center text-gray-400"
                >
                  Belum ada produk. Klik &quot;Tambah Produk&quot; untuk
                  memulai.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ProductForm
          mode={editing ? "edit" : "tambah"}
          defaultValues={
            editing
              ? {
                  id: editing.id,
                  name: editing.name,
                  price: editing.price,
                  category: editing.category,
                }
              : undefined
          }
          onClose={() => {
            setShowForm(false)
            setEditing(null)
          }}
        />
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="mb-2 text-lg font-bold text-gray-900">
              Hapus Produk
            </h3>
            <p className="mb-6 text-gray-600">
              Apakah Anda yakin ingin menghapus produk ini?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex h-12 flex-1 items-center justify-center rounded-xl border-2 border-gray-300 font-semibold text-gray-700 touch-manipulation"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={deleting}
                className="flex h-12 flex-1 items-center justify-center rounded-xl bg-red-600 font-semibold text-white shadow-sm disabled:opacity-50 touch-manipulation"
              >
                {deleting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
