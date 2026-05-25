"use client"

import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { CartItem, Product } from "@/types"

type CartAction =
  | { type: "ADD_ITEM"; product: Product }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" }

type CartContextType = {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  grandTotal: number
}

const CartContext = createContext<CartContextType | null>(null)

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.find((i) => i.product.id === action.product.id)
      if (existing) {
        return state.map((i) =>
          i.product.id === action.product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...state, { product: action.product, quantity: 1 }]
    }
    case "REMOVE_ITEM":
      return state.filter((i) => i.product.id !== action.productId)
    case "UPDATE_QUANTITY":
      if (action.quantity <= 0) {
        return state.filter((i) => i.product.id !== action.productId)
      }
      return state.map((i) =>
        i.product.id === action.productId
          ? { ...i, quantity: action.quantity }
          : i
      )
    case "CLEAR_CART":
      return []
    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, [])

  const addItem = (product: Product) =>
    dispatch({ type: "ADD_ITEM", product })
  const removeItem = (productId: string) =>
    dispatch({ type: "REMOVE_ITEM", productId })
  const updateQuantity = (productId: string, quantity: number) =>
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity })
  const clearCart = () => dispatch({ type: "CLEAR_CART" })

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const grandTotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
