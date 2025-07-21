// components/FeaturedProducts.jsx
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function FeaturedProducts({ products: propProducts }) {
  const [products, setProducts] = useState(propProducts || []);
  const [loading, setLoading] = useState(!propProducts);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !propProducts) {
      fetchProducts();
    }
  }, [isMounted, propProducts]);

  // Intersection Observer para animação do título
  useEffect(() => {
    if (!titleRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(titleRef.current);

    return () => {
      if (titleRef.current) {
        observer.unobserve(titleRef.current);
      }
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?per_page=8&featured=true');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos em destaque:', error);
      // Fallback com produtos mock
      setProducts([
        {
          id: 3,
          name: 'Casaco Oversized Moderno',
          price: '299.90',
          regular_price: '399.90',
          images: [{ src: '/images/nem_3251.png' }],
          slug: 'casaco-oversized-moderno'
        },
        {
          id: 4,
          name: 'Saia Midi Plissada',
          price: '159.90',
          regular_price: '199.90',
          images: [{ src: '/images/nem_3252.png' }],
          slug: 'saia-midi-plissada'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-80 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-80 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Título Animado */}
        <div className="text-center mb-12" ref={titleRef}>
          <h2 
            className={`text-4xl md:text-5xl font-bebas-neue text-gray-900 mb-4 transition-all duration-700 ${
              isVisible 
                ? 'transform translate-x-0 opacity-100' 
                : 'transform -translate-x-full opacity-0'
            }`}
          >
            PRODUTOS EM DESTAQUE
          </h2>
          <p className="text-lg text-gray-600 font-poppins max-w-2xl mx-auto">
            Nossa seleção especial dos produtos mais desejados. Peças que são sucesso absoluto entre nossas clientes.
          </p>
        </div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <Link 
              key={product.id} 
              href={`/product/${product.id}`}
              className="group block"
            >
              <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                {/* Imagem do Produto */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={product.images?.[0]?.src || '/images/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  
                  {/* Badge de Destaque */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                      DESTAQUE
                    </span>
                  </div>

                  {/* Badge de Desconto */}
                  {product.regular_price && parseFloat(product.regular_price) > parseFloat(product.price) && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {Math.round(((parseFloat(product.regular_price) - parseFloat(product.price)) / parseFloat(product.regular_price)) * 100)}% OFF
                      </span>
                    </div>
                  )}

                  {/* Overlay com ações */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors">
                        Ver Produto
                      </button>
                    </div>
                  </div>
                </div>

                {/* Informações do Produto */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 font-poppins">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center space-x-2">
                    {product.regular_price && parseFloat(product.regular_price) > parseFloat(product.price) && (
                      <span className="text-sm text-gray-500 line-through font-poppins">
                        R$ {parseFloat(product.regular_price).toFixed(2)}
                      </span>
                    )}
                    <span className="text-lg font-bold text-gray-900 font-poppins">
                      R$ {parseFloat(product.price).toFixed(2)}
                    </span>
                  </div>

                  {/* Parcelamento */}
                  <p className="text-sm text-gray-600 mt-1 font-poppins">
                    ou 3x de R$ {(parseFloat(product.price) / 3).toFixed(2)} sem juros
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Botão Ver Mais */}
        <div className="text-center mt-12">
          <Link 
            href="/products"
            className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full font-bebas-neue text-lg tracking-wide hover:bg-gray-800 transition-colors"
          >
            VER TODOS OS DESTAQUES
          </Link>
        </div>
      </div>
    </section>
  );
}

