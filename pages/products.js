import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import ProductGrid from "../components/ProductGrid";

export default function ProductsPage() {
  const router = useRouter();
  const { category, search } = router.query;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para filtros
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [availableColors, setAvailableColors] = useState([]); // Novo estado para cores disponíveis
  const [categories, setCategories] = useState([]); // Novo estado para categorias

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 12;

  // Ref para scroll
  const filtersRef = useRef(null);

  // Tamanhos numéricos
  const numericSizes = ["38", "40", "42", "44", "46", "48"];

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchAvailableColors(); // Buscar cores disponíveis ao carregar a página
  }, [
    category,
    search,
    sortBy,
    currentPage,
    priceRange,
    selectedSizes,
    selectedColors,
  ]); // Adicionado dependências dos filtros

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // Aumentado para 10 segundos

      const params = new URLSearchParams({
        per_page: productsPerPage.toString(),
        page: currentPage.toString(),
        orderby: sortBy.includes("price") ? "price" : "date",
        order: sortBy === "price-desc" ? "desc" : "asc",
      });

      // Adiciona filtro por categoria se houver
      if (category) {
        params.append("category", category);
      }
      // Adiciona filtro por busca se houver
      if (search) {
        params.append("search", search);
      }

      // Adiciona filtro por faixa de preço
      if (priceRange[0] > 0 || priceRange[1] < 1000) {
        // Supondo que sua API suporta min_price e max_price
        params.append("min_price", priceRange[0].toString());
        params.append("max_price", priceRange[1].toString());
      }

      // Adiciona filtro por tamanhos (assumindo que sua API aceita um parâmetro 'size' ou 'attribute')
      // Você precisará verificar como sua API lida com filtros de atributos/tamanhos.
      // Exemplo genérico:
      if (selectedSizes.length > 0) {
        params.append("size", selectedSizes.join(",")); // Ou o nome do parâmetro de atributo correto da sua API
      }

      // Adiciona filtro por cores (assumindo que sua API aceita um parâmetro 'color' ou 'attribute')
      // Você precisará verificar como sua API lida com filtros de atributos/cores.
      // Exemplo genérico:
      if (selectedColors.length > 0) {
        params.append("color", selectedColors.join(",")); // Ou o nome do parâmetro de atributo correto da sua API
      }

      const response = await fetch(`/api/products?${params}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`);
      }

      const data = await response.json();

      if (data && data.products) {
        setProducts(data.products);
        setTotalPages(data.total_pages || 1);
        setTotalProducts(data.total || 0);
      } else {
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setError(
        "Não foi possível carregar os produtos. Verifique sua conexão ou tente novamente mais tarde."
      );
      // Fallback com produtos mock (mantido do seu código original)
      const mockProducts = [
        {
          id: 1,
          name: "Vestido Floral Primavera",
          price: "189.90",
          regular_price: "249.90",
          images: [{ src: "/images/nem_3249.jpg" }],
          slug: "vestido-floral-primavera",
          on_sale: true,
          stock_quantity: 15,
          attributes: [
            { name: "Tamanho", options: ["40"] },
            { name: "Cor", options: ["Vermelho"] },
          ],
        },
        {
          id: 2,
          name: "Blusa Manga Longa Elegante",
          price: "129.90",
          regular_price: "159.90",
          images: [{ src: "/images/nem_3250.jpg" }],
          slug: "blusa-manga-longa-elegante",
          on_sale: true,
          stock_quantity: 8,
          attributes: [
            { name: "Tamanho", options: ["38", "42"] },
            { name: "Cor", options: ["Preto"] },
          ],
        },
        {
          id: 3,
          name: "Casaco Oversized Moderno",
          price: "299.90",
          regular_price: "399.90",
          images: [{ src: "/images/nem_3251.png" }],
          slug: "casaco-oversized-moderno",
          on_sale: true,
          stock_quantity: 5,
          attributes: [
            { name: "Tamanho", options: ["44"] },
            { name: "Cor", options: ["Azul"] },
          ],
        },
        {
          id: 4,
          name: "Saia Midi Plissada",
          price: "159.90",
          regular_price: "199.90",
          images: [{ src: "/images/nem_3252.png" }],
          slug: "saia-midi-plissada",
          on_sale: true,
          stock_quantity: 12,
          attributes: [
            { name: "Tamanho", options: ["40"] },
            { name: "Cor", options: ["Verde"] },
          ],
        },
        {
          id: 5,
          name: "Jaqueta Jeans Vintage",
          price: "219.90",
          regular_price: "279.90",
          images: [{ src: "/images/nem_3253.png" }],
          slug: "jaqueta-jeans-vintage",
          on_sale: true,
          stock_quantity: 7,
          attributes: [
            { name: "Tamanho", options: ["42", "46"] },
            { name: "Cor", options: ["Azul"] },
          ],
        },
        {
          id: 6,
          name: "Vestido Midi Estampado",
          price: "179.90",
          regular_price: "229.90",
          images: [{ src: "/images/nem_3255.png" }],
          slug: "vestido-midi-estampado",
          on_sale: true,
          stock_quantity: 10,
          attributes: [
            { name: "Tamanho", options: ["38"] },
            { name: "Cor", options: ["Rosa"] },
          ],
        },
        {
          id: 7,
          name: "Blusa Cropped Moderna",
          price: "89.90",
          regular_price: "119.90",
          images: [{ src: "/images/nem_3256.png" }],
          slug: "blusa-cropped-moderna",
          on_sale: true,
          stock_quantity: 20,
          attributes: [
            { name: "Tamanho", options: ["38", "40", "42"] },
            { name: "Cor", options: ["Branco"] },
          ],
        },
        {
          id: 8,
          name: "Calça Wide Leg Elegante",
          price: "199.90",
          regular_price: "259.90",
          images: [{ src: "/images/nem_3257.png" }],
          slug: "calca-wide-leg-elegante",
          on_sale: true,
          stock_quantity: 6,
          attributes: [
            { name: "Tamanho", options: ["42", "44"] },
            { name: "Cor", options: ["Preto"] },
          ],
        },
      ];
      setProducts(mockProducts);
      setTotalProducts(mockProducts.length);
      setTotalPages(Math.ceil(mockProducts.length / productsPerPage));
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error(`Erro ao buscar categorias: ${response.statusText}`);
      }
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      // Você pode definir um estado de erro para categorias se desejar
    }
  };

  // Nova função para buscar cores disponíveis
  const fetchAvailableColors = async () => {
    // Em um cenário real, você buscaria as cores dos atributos da sua API
    // Por enquanto, usaremos uma lista estática para demonstração
    setAvailableColors([
      "Preto",
      "Branco",
      "Azul",
      "Vermelho",
      "Rosa",
      "Verde",
      "Amarelo",
      "Cinza",
    ]);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (filtersRef.current) {
      filtersRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleClearFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSortBy("date");
    setCurrentPage(1);
    // Para limpar a categoria e busca da URL, você pode usar router.push
    router.push("/products", undefined, { shallow: true });
  };

  const getPageTitle = () => {
    if (search) return `Busca: ${search}`;
    if (category) {
      const selectedCategory = categories.find((cat) => cat.slug === category);
      return selectedCategory ? selectedCategory.name : "Produtos";
    }
    return "Todos os Produtos";
  };

  const getPageDescription = () => {
    if (search) return `Resultados da busca por "${search}" na NEM Store.`;
    if (category)
      return `Explore nossa coleção de ${getPageTitle().toLowerCase()} na NEM Store.`;
    return "Explore nossa coleção completa de moda feminina na NEM Store.";
  };

  return (
    <>
      <Head>
        <title>{getPageTitle()} • NEM Store</title>
        <meta name="description" content={getPageDescription()} />
        <meta
          name="keywords"
          content={`${getPageTitle()}, moda feminina, roupas, NEM Store`}
        />
      </Head>

      <Header />

      <PageHero
        customTitle={getPageTitle()}
        customDescription={getPageDescription()}
      />

      <div className="min-h-screen bg-gray-50 font-poppins">
        <div
          ref={filtersRef}
          className="sticky top-0 z-40 bg-white border-b border-gray-200 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-1 px-2 py-1 border font-thin text-sm border-gray-300 rounded-md hover:border-yellow-600 hover:text-yellow-600 transition-colors font-poppins">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
                    />
                  </svg>
                  <span className="text-sm">Filtros</span>
                </button>
                <div className="text-sm text-gray-600">
                  {loading
                    ? "Carregando..."
                    : `${totalProducts} produto${
                        totalProducts !== 1 ? "s" : ""
                      }`}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 text-sm rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-poppins">
                  <option value="date">Mais Recentes</option>
                  <option value="popularity">Mais Populares</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex container mx-auto px-4 py-8">
          {/* Sidebar de Filtros */}
          <aside
            className={`w-64 flex-shrink-0 pr-8 transition-all duration-300 ${
              showFilters ? "block" : "hidden"
            }`}>
            <div className="sticky top-20">
              <h3 className="text-md font-bebas-neue mb-4">FILTROS</h3>

              <div className="space-y-6">
                {/* Categorias */}
                <div>
                  <h4 className="font-small mb-3 font-bebas-neue">
                    CATEGORIAS
                  </h4>
                  <ul className="space-y-2">
                    <li key="all-categories">
                      <button
                        onClick={() => router.push("/products")}
                        className={`text-sm font-poppins hover:text-gray-900 transition-colors ${
                          !category
                            ? "font-semibold text-gray-900"
                            : "text-gray-600"
                        }`}>
                        Todas as Categorias
                      </button>
                    </li>
                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <button
                          onClick={() =>
                            router.push(`/products?category=${cat.slug}`)
                          }
                          className={`text-sm font-poppins hover:text-gray-900 transition-colors ${
                            category === cat.slug
                              ? "font-semibold text-gray-900"
                              : "text-gray-600 hover:text-yellow-600"
                          }`}>
                          {cat.name} ({cat.count})
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Faixa de Preço */}
                <div>
                  <h4 className="font-small mb-3 font-bebas-neue">
                    FAIXA DE PREÇO
                  </h4>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 font-poppins">
                      <span>R$ {priceRange[0]}</span>
                      <span>R$ {priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Tamanhos */}
                <div>
                  <h4 className="font-medium mb-3 font-bebas-neue">TAMANHOS</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {numericSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSizes((prev) =>
                            prev.includes(size)
                              ? prev.filter((s) => s !== size)
                              : [...prev, size]
                          );
                        }}
                        className={`px-3 py-2 border rounded text-sm transition font-poppins ${
                          selectedSizes.includes(size)
                            ? "bg-gray-900 text-white border-gray-900"
                            : "border-gray-300 hover:bg-blue-900 hover:text-white"
                        }`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cores */}
                <div>
                  <h4 className="font-medium mb-3 font-bebas-neue">CORES</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          setSelectedColors((prev) =>
                            prev.includes(color)
                              ? prev.filter((c) => c !== color)
                              : [...prev, color]
                          );
                        }}
                        className={`px-3 py-2 border rounded text-sm transition font-poppins ${
                          selectedColors.includes(color)
                            ? "bg-gray-900 text-white border-gray-900"
                            : "border-gray-300 hover:border-gray-400"
                        }`}>
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <button
                    onClick={handleClearFilters}
                    className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-blue-900 hover:text-white transition-colors font-poppins">
                    Limpar Filtros
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Grid de Produtos */}
          <main className="flex-1">
            <ProductGrid
              products={products}
              loading={loading}
              error={error}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
}
