// components/ProductGridItem.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiHeart, FiShoppingBag, FiEye } from "react-icons/fi";

export default function ProductGridItem({ product, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].src
      : "/images/placeholder.png";

  const price = parseFloat(product.price || 0).toFixed(2);
  const regularPrice = product.regular_price
    ? parseFloat(product.regular_price).toFixed(2)
    : null;
  const isOnSale = product.on_sale;

  const discountPercentage =
    isOnSale && regularPrice && parseFloat(price) < parseFloat(regularPrice)
      ? Math.round(((regularPrice - price) / regularPrice) * 100)
      : 0;

  const baseClasses =
    "group relative bg-white rounded-lg overflow-hidden shadow-sm";
  const animatedClasses = mounted
    ? "hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
    : "";

  return (
    <div
      className={`${baseClasses} ${animatedClasses}`}
      onMouseEnter={() => mounted && setIsHovered(true)}
      onMouseLeave={() => mounted && setIsHovered(false)}>
      {isOnSale && discountPercentage > 0 && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {discountPercentage}% OFF
          </span>
        </div>
      )}

      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        <Image
          src={imageUrl}
          // CORREÇÃO: Usando product.name em vez de product.title
          alt={product.name || "Imagem do Produto"}
          fill
          className={`object-cover ${
            mounted ? "transition-all duration-700" : ""
          } ${isHovered ? "scale-110" : "scale-100"} ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {mounted && (
          <div
            className={`absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center transition-all duration-300 ${
              isHovered ? "bg-opacity-40" : ""
            }`}>
            <div
              className={`flex space-x-3 transform transition-all duration-300 ${
                isHovered
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}>
              <button className="bg-white text-gray-900 p-3 hover:bg-red-500 rounded-full hover:text-white transition-colors shadow-lg">
                <FiHeart className="w-5 h-5" />
              </button>
              <Link href={`/product/${product.id}`} legacyBehavior>
                <a className="bg-white text-gray-900 hover:bg-yellow-800 hover:text-white p-3 rounded-full transition-colors shadow-lg">
                  <FiEye className="w-5 h-5" />
                </a>
              </Link>
              <button className="bg-white text-gray-900 hover:bg-sky-950 hover:text-white p-3 rounded-full transition-colors shadow-lg">
                <FiShoppingBag className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <Link href={`/product/${product.id}`} legacyBehavior>
          <a>
            {/* CORREÇÃO: Usando product.name em vez de product.title */}
            <h3 className="font-poppins text-sm font-medium text-gray-900 line-clamp-2 cursor-pointer mb-2 hover:text-indigo-600 transition-colors">
              {product.title}
            </h3>
          </a>
        </Link>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-bebas-neue text-lg text-gray-900">
              R$ {price}
            </span>
            {isOnSale && regularPrice && (
              <span className="text-sm text-gray-500 line-through">
                R$ {regularPrice}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 font-poppins">
            ou 10× de R$ {(parseFloat(price) / 10).toFixed(2)} sem juros
          </p>
        </div>
        <Link href={`/product/${product.id}`} legacyBehavior>
          <a
            className={`block w-full mt-3 bg-indigo-950 text-amber-100 text-center py-2 px-4 rounded-md font-poppings text-sm tracking-wide hover:bg-stone-500 hover:text-indigo-950 hover:font-bold transition-colors duration-300`}>
            Detalhes do Produto
          </a>
        </Link>
      </div>
    </div>
  );
}
