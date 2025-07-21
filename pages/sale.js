// pages/sale.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductGrid from '../components/ProductGrid';
import { FiPercent, FiClock, FiTag, FiFilter } from 'react-icons/fi';

export default function SalePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('discount');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    fetchSaleProducts();
  }, []);

  const fetchSaleProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products?on_sale=true');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao carregar produtos em promoção:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedProducts = products.sort((a, b) => {
    switch (sortBy) {
      case 'discount':
        return (b.sale_price ? ((b.regular_price - b.sale_price) / b.regular_price) * 100 : 0) - 
               (a.sale_price ? ((a.regular_price - a.sale_price) / a.regular_price) * 100 : 0);
      case 'price_low':
        return (a.sale_price || a.regular_price) - (b.sale_price || b.regular_price);
      case 'price_high':
        return (b.sale_price || b.regular_price) - (a.sale_price || a.regular_price);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const filteredProducts = sortedProducts.filter(product => {
    if (filterBy === 'all') return true;
    if (filterBy === 'high_discount') {
      const discount = product.sale_price ? ((product.regular_price - product.sale_price) / product.regular_price) * 100 : 0;
      return discount >= 30;
    }
    return product.categories?.some(cat => cat.slug === filterBy);
  });

  const getDiscountPercentage = (regularPrice, salePrice) => {
    if (!salePrice) return 0;
    return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
  };

  return (
    <>
      <Head>
        <title>Sale - Promoções Nem Store</title>
        <meta name="description" content="Aproveite as melhores promoções da Nem Store! Peças selecionadas com descontos imperdíveis. Moda feminina com preços especiais." />
        <meta name="keywords" content="promoção, sale, desconto, moda feminina, nem store, ofertas" />
      </Head>

      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <FiPercent className="text-white text-6xl mr-4" />
              <h1 className="text-5xl md:text-7xl font-bold text-white">
                SALE
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-pink-100 mb-8 max-w-3xl mx-auto">
              Descontos imperdíveis em peças selecionadas! 
              Aproveite para renovar seu guarda-roupa com estilo e economia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-white font-semibold">Até 70% OFF</span>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-white font-semibold">Frete Grátis acima de R$ 299</span>
              </div>
            </div>
          </div>
        </section>

        {/* Promotion Highlights */}
        <section className="py-12 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiTag className="text-red-600 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Descontos Progressivos
                </h3>
                <p className="text-gray-600 text-sm">
                  Quanto mais você compra, mais desconto ganha. 
                  Combine peças e economize ainda mais!
                </p>
              </div>

              <div className="text-center">
                <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiClock className="text-pink-600 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Oferta por Tempo Limitado
                </h3>
                <p className="text-gray-600 text-sm">
                  Promoções válidas enquanto durarem os estoques. 
                  Não perca a oportunidade!
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiPercent className="text-purple-600 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Melhores Preços
                </h3>
                <p className="text-gray-600 text-sm">
                  Garantimos os melhores preços do mercado. 
                  Qualidade Nem com preços especiais.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters and Sorting */}
        <section className="py-8 bg-white border-b sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <FiFilter className="text-gray-500" />
                <span className="font-medium text-gray-700">Filtrar por:</span>
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="all">Todos os produtos</option>
                  <option value="high_discount">Desconto acima de 30%</option>
                  <option value="blusas">Blusas</option>
                  <option value="calcas">Calças</option>
                  <option value="saias">Saias</option>
                  <option value="vestidos">Vestidos</option>
                  <option value="acessorios">Acessórios</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700">Ordenar por:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="discount">Maior desconto</option>
                  <option value="price_low">Menor preço</option>
                  <option value="price_high">Maior preço</option>
                  <option value="name">Nome A-Z</option>
                </select>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'} em promoção
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                    <div className="h-64 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <FiTag className="text-gray-300 text-6xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum produto em promoção encontrado
                </h3>
                <p className="text-gray-600 mb-6">
                  Tente ajustar os filtros ou volte mais tarde para novas ofertas.
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  Ver Todos os Produtos
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => {
                  const discount = getDiscountPercentage(product.regular_price, product.sale_price);
                  return (
                    <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow group">
                      <div className="relative">
                        <Link href={`/product/${product.id}`}>
                          <div className="aspect-w-3 aspect-h-4 bg-gray-100">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0].src}
                                alt={product.name}
                                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-64 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                                <span className="text-gray-400 text-4xl">📷</span>
                              </div>
                            )}
                          </div>
                        </Link>
                        
                        {discount > 0 && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            -{discount}%
                          </div>
                        )}
                        
                        {discount >= 50 && (
                          <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                            SUPER OFERTA
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <Link href={`/product/${product.id}`}>
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-pink-600 transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        <div className="flex items-center gap-2 mb-3">
                          {product.sale_price ? (
                            <>
                              <span className="text-lg font-bold text-red-600">
                                R$ {parseFloat(product.sale_price).toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                R$ {parseFloat(product.regular_price).toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">
                              R$ {parseFloat(product.regular_price).toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-gray-500 mb-3">
                          ou 10× de R$ {(parseFloat(product.sale_price || product.regular_price) / 10).toFixed(2)}
                        </div>

                        <button className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors font-medium">
                          Comprar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-gradient-to-r from-pink-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Não Perca Nenhuma Promoção!
            </h2>
            <p className="text-pink-100 text-lg mb-8">
              Cadastre-se e seja a primeira a saber sobre nossas ofertas exclusivas, 
              lançamentos e promoções especiais.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu melhor email"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-pink-300"
              />
              <button className="bg-white text-pink-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Cadastrar
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

