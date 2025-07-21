// context/CartContext.js (A versão completa e corrigida)
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const generateCartItemId = (productId, size, color) => {
    return `${productId}-${size || "no-size"}-${color || "no-color"}`;
  };

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("nem-store-cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          const itemsWithCartId = parsedCart.map((item) => ({
            ...item,
            cartItemId:
              item.cartItemId ||
              generateCartItemId(
                item.id,
                item.selectedSize,
                item.selectedColor
              ),
          }));
          setItems(itemsWithCartId);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar carrinho do localStorage:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("nem-store-cart", JSON.stringify(items));
      } catch (error) {
        console.error("Erro ao salvar carrinho no localStorage:", error);
      }
    }
  }, [items, isLoaded]);

  const addItem = (productData) => {
    const {
      id,
      name,
      price,
      images,
      quantity = 1,
      selectedSize = null,
      selectedColor = null,
    } = productData;

    const cartItemId = generateCartItemId(id, selectedSize, selectedColor);

    setItems((currentItems) => {
      const existingItemIndex = currentItems.findIndex(
        (item) => item.cartItemId === cartItemId
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += quantity;
        toast.success(`Quantidade de "${name}" atualizada!`, {
          position: "top-right",
        });
        return updatedItems;
      } else {
        const productImage =
          images && Array.isArray(images) && images.length > 0
            ? images[0]?.src || ""
            : "";

        toast.success(`"${name}" adicionado ao carrinho!`, {
          position: "top-right",
        });
        return [
          ...currentItems,
          {
            cartItemId,
            id,
            title: name,
            price: parseFloat(price) || 0,
            image: productImage,
            quantity,
            selectedSize,
            selectedColor,
          },
        ];
      }
    });
    setIsOpen(true); // Abre o carrinho ao adicionar um item
  };

  // DEFINIÇÃO DA FUNÇÃO toggleCart AQUI
  const toggleCart = () => {
    setIsOpen((prev) => !prev);
  };

  const removeItem = (productId, selectedSize = null, selectedColor = null) => {
    const cartItemIdToRemove = generateCartItemId(
      productId,
      selectedSize,
      selectedColor
    );

    setItems((currentItems) => {
      const filteredItems = currentItems.filter(
        (item) => item.cartItemId !== cartItemIdToRemove
      );
      toast.info("Item removido do carrinho.", { position: "top-right" });
      return filteredItems;
    });
  };

  const updateQuantity = (
    productId,
    newQuantity,
    selectedSize = null,
    selectedColor = null
  ) => {
    const cartItemIdToUpdate = generateCartItemId(
      productId,
      selectedSize,
      selectedColor
    );

    if (newQuantity <= 0) {
      removeItem(productId, selectedSize, selectedColor);
      return;
    }

    setItems((currentItems) => {
      const updatedItems = currentItems.map((item) =>
        item.cartItemId === cartItemIdToUpdate
          ? { ...item, quantity: newQuantity }
          : item
      );
      return updatedItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    toast.info("Carrinho limpo!", { position: "top-right" });
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce(
      (total, item) => total + parseFloat(item.price) * item.quantity,
      0
    );
  };

  const isInCart = (productId, selectedSize = null, selectedColor = null) => {
    const cartItemIdToCheck = generateCartItemId(
      productId,
      selectedSize,
      selectedColor
    );
    return items.some((item) => item.cartItemId === cartItemIdToCheck);
  };

  const getItemQuantity = (
    productId,
    selectedSize = null,
    selectedColor = null
  ) => {
    const cartItemIdToGet = generateCartItemId(
      productId,
      selectedSize,
      selectedColor
    );
    const item = items.find((item) => item.cartItemId === cartItemIdToGet);
    return item ? item.quantity : 0;
  };

  const value = {
    items,
    isOpen,
    setIsOpen,
    isLoaded,
    addItem,
    toggleCart, // Está definida e exportada aqui!
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
