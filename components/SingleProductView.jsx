// components/SingleProductView.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { useCart } from "../context/CartContext";

export default function SingleProductView({ product }) {
  const [mounted, setMounted] = useState(false);
  // CORRIGIDO: Alterado 'addToCart' para 'addItem' para corresponder ao CartContext
  const { addItem, toggleCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showSizeWarning, setShowSizeWarning] = useState(false);
  const [showSizeChartModal, setShowSizeChartModal] = useState(false); // NOVO ESTADO: controla a visibilidade do modal

  const { availableSizes, colors } = product;

  const hasSizeAttribute = availableSizes && availableSizes.length > 0;

  useEffect(() => {
    setMounted(true);
    if (colors && colors.length > 0) {
      setSelectedColor(colors[0]);
    }
    setCurrentImageIndex(0);
    // Resetar o tamanho selecionado e aviso ao mudar de produto
    if (hasSizeAttribute) {
      setSelectedSize(""); // Limpa a seleção para forçar o usuário a escolher
    }
    setShowSizeWarning(false); // Limpa o aviso ao carregar um novo produto
  }, [product.id, colors, hasSizeAttribute]);

  const handleAddToCart = () => {
    // Lógica de validação: Não permite adicionar sem escolher um tamanho
    if (hasSizeAttribute && !selectedSize) {
      setShowSizeWarning(true); // Exibe o aviso
      return; // Interrompe a função, impedindo a adição ao carrinho
    }

    setShowSizeWarning(false); // Esconde qualquer aviso prévio

    // Prepara os dados do produto para adicionar ao carrinho
    const productData = {
      id: product.id,
      name: product.name, // CORRIGIDO: Usando 'name' para corresponder ao que CartContext espera para o título
      price: product.price,
      // CORRIGIDO: Passando 'images' como um array de objetos, conforme CartContext espera
      images:
        product.images && product.images.length > 0
          ? [{ src: product.images[0].src }]
          : [{ src: "/images/placeholder.png" }],
      size: selectedSize, // Passa o tamanho selecionado
      color: selectedColor, // Passa a cor selecionada
      qty: quantity, // Passa a quantidade
    };

    addItem(productData); // Chama a função addItem do CartContext
    // REMOVIDO: A chamada a toggleCart() aqui, pois addItem() já abre o carrinho.
  };

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images.map((img) => img.src)
      : ["/images/placeholder.png"];

  const formatPrice = (price) => {
    const numPrice = parseFloat(price) || 0;
    return `R$ ${numPrice.toFixed(2).replace(".", ",")}`;
  };

  const calculateDiscount = () => {
    const regular = parseFloat(product.regular_price);
    const current = parseFloat(product.price);
    if (!regular || !current || regular <= current) return 0;
    return Math.round(((regular - current) / regular) * 100);
  };

  if (!mounted || !product) {
    return null;
  }

  // Função auxiliar para obter o código hexadecimal da cor
  const getColorCode = (colorName) => {
    switch (colorName.toLowerCase()) {
      case "branco":
        return "#FFFFFF";
      case "preto":
        return "#000000";
      case "vermelho":
        return "#FF0000";
      case "azul":
        return "#0000FF";
      case "verde":
        return "#008000";
      case "amarelo":
        return "#FFFF00";
      case "rosa":
        return "#FFC0CB";
      case "roxo":
        return "#800080";
      case "cinza":
        return "#808080";
      case "laranja":
        return "#FFA500";
      case "marrom":
        return "#A52A2A";
      case "bege":
        return "#F5F5DC";
      case "dourado":
        return "#FFD700";
      case "prata":
        return "#C0C0C0";
      default:
        return "#CCCCCC"; // Cor padrão para desconhecidas
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative w-full h-96 md:h-[500px] lg:h-[600px] bg-gray-100 rounded-lg overflow-hidden">
              <Image
                key={`${product.id}-${currentImageIndex}`}
                src={images[currentImageIndex]}
                alt={product.name || "Imagem do Produto"}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover cursor-pointer"
                onClick={() => setShowImageModal(true)}
                priority
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImageIndex(
                        (i) => (i - 1 + images.length) % images.length
                      )
                    }
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10">
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((i) => (i + 1) % images.length)
                    }
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10">
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Miniaturas das imagens */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-full h-20 bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index
                        ? "border-indigo-600"
                        : "border-transparent"
                    }`}>
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 12vw"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <nav className="text-sm text-gray-500 font-poppins">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/products" className="hover:underline">
                Produtos
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{product.name}</span>
            </nav>

            <h1 className="text-3xl font-bebas-neue text-yellow-900">
              {product.name}
            </h1>

            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-stone-900 font-bebas-neue">
                  {formatPrice(product.price)}
                </span>
                {calculateDiscount() > 0 && (
                  <>
                    <span className="text-xl text-gray-500 line-through font-poppins">
                      {formatPrice(product.regular_price)}
                    </span>
                    <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                      -{calculateDiscount()}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {product.short_description && (
              <div
                className="prose prose-sm max-w-none font-poppins"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            )}

            {hasSizeAttribute && (
              <div className="space-y-3">
                <span className="font-medium font-bebas-neue text-lg">
                  TAMANHO
                </span>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md font-poppins transition-all ${
                        selectedSize === size
                          ? "bg-gray-900 text-white border-gray-900"
                          : "border-gray-300 hover:border-gray-400 hover:bg-yellow-900 hover:text-white"
                      }`}>
                      {size}
                    </button>
                  ))}
                </div>
                {showSizeWarning && (
                  <p className="text-red-500 text-sm mt-2">
                    Por favor, selecione um tamanho.
                  </p>
                )}
                {/* NOVO: Link "Guia de Medidas" */}
                <button
                  onClick={() => setShowSizeChartModal(true)}
                  className="text-sm text-blue-700 underline hover:no-underline cursor-pointer mt-2 block">
                  Guia de Medidas
                </button>
              </div>
            )}

            {colors && colors.length > 0 && (
              <div className="space-y-3">
                <span className="font-medium font-bebas-neue text-lg">COR</span>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all
                        ${
                          selectedColor === color
                            ? "border-gray-900"
                            : "border-gray-300 hover:border-gray-400"
                        }
                      `}
                      style={{ backgroundColor: getColorCode(color) }}
                      title={color}>
                      {getColorCode(color) === "#FFFFFF" && (
                        <span className="w-6 h-6 rounded-full border border-gray-300"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <span className="font-medium font-bebas-neue text-lg">
                QUANTIDADE
              </span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 font-bebas-neue">
                  -
                </button>
                <span className="w-12 text-center font-poppins">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 font-bebas-nebe">
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-4 px-6 font-bebas-neue bg-stone-500 text-white text-lg tracking-wide transition-colors
              ${
                hasSizeAttribute && !selectedSize // Se tem tamanho e não foi selecionado
                  ? "bg-gray-400 cursor-not-allowed" // Estilo desabilitado
                  : "bg-gray-900 hover:bg-gray-800" // Estilo normal
              }`}>
              ADICIONAR AO CARRINHO
            </button>
          </div>
        </div>
      </div>

      {/* Modal da imagem (existente) */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10">
              <FiX className="w-8 h-8" />
            </button>
            <Image
              src={images[currentImageIndex]}
              alt={product.name}
              width={800}
              height={800}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* NOVO: Modal do Guia de Medidas */}
      {showSizeChartModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
          onClick={() => setShowSizeChartModal(false)} // Clica fora para fechar
        >
          <div
            className="relative bg-white p-6 rounded-lg shadow-xl max-w-full max-h-[90vh] overflow-auto w-full md:w-3/4 lg:w-2/3 xl:w-1/2" // Adicionado largura responsiva
            onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do modal o feche
          >
            {/* Botão de Fechar */}
            <button
              onClick={() => setShowSizeChartModal(false)}
              className="absolute top-3 right-3 text-gray-700 hover:text-gray-900 text-2xl font-bold p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
              aria-label="Fechar">
              <FiX />
            </button>
            {/* Título */}
            <h3 className="text-2xl font-semibold mb-4 text-center text-gray-800">
              Guia de Medidas
            </h3>
            <hr className="mb-6 border-gray-300" /> {/* Linha divisória */}
            {/* Imagem da Tabela de Medidas */}
            <div className="flex justify-center items-center mb-8">
              <Image
                src="/images/tabela-medidas.png" // Caminho para sua imagem
                alt="Tabela de Medidas"
                width={800} // Defina uma largura apropriada para sua imagem
                height={600} // Defina uma altura apropriada para sua imagem
                layout="intrinsic" // Mantém as proporções da imagem
                className="max-w-full h-auto rounded" // Garante que a imagem se ajuste ao modal
              />
            </div>
            {/* Seções de Informação Adicional */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Trocas e Devoluções */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col items-center text-center">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Trocas e Devoluções
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Saiba mais sobre nossa política de trocas e devoluções.
                </p>
                <Link href="/trocas-devolucoes">
                  <button
                    onClick={() => setShowSizeChartModal(false)} // Fecha o modal ao navegar
                    className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition-colors">
                    Saiba mais
                  </button>
                </Link>
              </div>

              {/* Precisa de Ajuda? */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col items-center text-center">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Precisa de Ajuda?
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Entre em contato conosco para qualquer dúvida ou suporte.
                </p>
                <Link href="/contato">
                  <button
                    onClick={() => setShowSizeChartModal(false)} // Fecha o modal ao navegar
                    className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition-colors">
                    Entre em contato
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
