/* components/Header.jsx */
"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FiSearch,
  FiUser,
  FiShoppingBag,
  FiHeart,
  FiMapPin,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiChevronDown,
} from "react-icons/fi";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Header({ staticMenu = false }) {
  const { getTotalItems, setIsOpen } = useCart();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const messages = [
    "Ganhe 10% OFF na coleção com código de vendedor SHOP NOW",
    "Frete Grátis",
    "Parcelamento em até 10 X sem Juros",
    "1ª Troca Grátis | Confira as condições",
  ];
  const [msgIndex, setMsgIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setMsgIndex((i) => (i + 1) % messages.length),
      5000
    );
    return () => clearInterval(id);
  }, []);

  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [productCategories, setProductCategories] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (!staticMenu) {
      const onScroll = () => {
        setScrolled(window.scrollY > 50);
        // Fechar submenu ao scroll
        setOpenMenu(null);
        setMobileSubmenuOpen(null);
      };
      window.addEventListener("scroll", onScroll);
      onScroll();
      return () => window.removeEventListener("scroll", onScroll);
    }
  }, [staticMenu]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products for categories");

        const data = await res.json();
        const products = data.products;

        if (!Array.isArray(products)) {
          console.error(
            "A resposta da API não contém um array de produtos válido."
          );
          return;
        }

        const allUniqueCategories = new Set();
        products.forEach((p) => {
          if (p.categories && Array.isArray(p.categories)) {
            p.categories.forEach((cat) => allUniqueCategories.add(cat.name));
          }
        });
        const sortedCategories = Array.from(allUniqueCategories)
          .filter(Boolean)
          .sort();
        setProductCategories(sortedCategories);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (showSearchBar && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearchBar]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  const effectiveScrolled = staticMenu || scrolled;
  const slug = (label) => "/" + label.toLowerCase().replace(/\s+/g, "-");
  const toggleItem = (name) => setOpenMenu(openMenu === name ? null : name);

  const institucional = ["Sobre Nós", "Nossa História", "Equipe", "Contato"];
  const blog = ["Dicas", "Novidades", "Entrevistas", "Eventos"];
  const sale = [
    "Outlet",
    "Últimas Peças",
    "Descontos Especiais",
    "Queima de Estoque",
    "Black Friday",
    "Cupom Exclusivo",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setShowSearchBar(false);
    }
  };

  const toggleCart = () => {
    setIsOpen((prev) => !prev);
  };

  const handleMenuEnter = (menuName) => {
    // Limpar timeout existente
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setOpenMenu(menuName);
  };

  const handleMenuLeave = () => {
    // Usar timeout para permitir navegação para o submenu
    const timeout = setTimeout(() => {
      setOpenMenu(null);
    }, 150); // 150ms de delay
    setHoverTimeout(timeout);
  };

  const handleSubmenuEnter = () => {
    // Cancelar o timeout se o mouse entrar no submenu
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  const handleSubmenuLeave = () => {
    // Fechar imediatamente quando sair do submenu
    setOpenMenu(null);
  };

  const handleHeaderEnter = () => {
    setIsHovering(true);
  };

  const handleHeaderLeave = () => {
    setIsHovering(false);
  };

  const toggleMobileSubmenu = (menuName) => {
    setMobileSubmenuOpen(mobileSubmenuOpen === menuName ? null : menuName);
  };

  // Classes dinâmicas baseadas no scroll e hover
  const headerBgClass =
    effectiveScrolled || isHovering
      ? "bg-white bg-opacity-95 backdrop-blur-sm shadow-lg"
      : "bg-transparent";

  const textColorClass =
    effectiveScrolled || isHovering ? "text-sky-950" : "text-white";

  const iconColorClass =
    effectiveScrolled || isHovering
      ? "text-sky-950 hover:text-sky-950"
      : "text-white hover:text-gray-200";

  const underlineColorClass =
    effectiveScrolled || isHovering ? "bg-sky-950" : "bg-white";

  return (
    <header className="fixed top-0 w-full z-50">
      {/* Barra promocional */}
      <div className="bg-black text-white text-center text-xs py-1.5 sm:py-2 px-2 sm:px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-800 to-black animate-pulse"></div>
        <button className="absolute left-1 sm:left-4 top-1/2 transform -translate-y-1/2 p-0.5 sm:p-1 rounded-full hover:bg-white hover:bg-opacity-10 transition-all duration-200 z-10">
          <FiChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
        <span className="font-light tracking-wide relative z-10 text-xs px-6 sm:px-8">
          {messages[msgIndex]}
        </span>
        <button className="absolute right-1 sm:right-4 top-1/2 transform -translate-y-1/2 p-0.5 sm:p-1 rounded-full hover:bg-white hover:bg-opacity-10 transition-all duration-200 z-10">
          <FiChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
        <button className="absolute right-6 sm:right-12 top-1/2 transform -translate-y-1/2 p-0.5 sm:p-1 rounded-full hover:bg-white hover:bg-opacity-10 transition-all duration-200 z-10">
          <FiX className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Header principal */}
      <div
        className={`${headerBgClass} transition-all duration-500 ease-in-out relative`}
        onMouseEnter={handleHeaderEnter}
        onMouseLeave={handleHeaderLeave}>
        <div className="container mx-auto px-3 sm:px-4">
          {/* Layout Desktop - quando não scrolled - Logo em cima */}
          {!effectiveScrolled && (
            <>
              {/* Primeira linha: Logo centralizado - Hidden on mobile */}
              <div className="hidden lg:flex items-center justify-center py-6">
                <Link href="/" className="flex items-center">
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-200">
                    <span className="text-white text-lg font-bold tracking-wider">
                      nem
                    </span>
                  </div>
                </Link>
              </div>

              {/* Segunda linha: Ícones e Menu - Hidden on mobile */}
              <div className="hidden lg:flex items-center justify-between pb-4">
                {/* Ícones da esquerda */}
                <div className="flex items-center space-x-6">
                  <button
                    className={`w-5 h-5 ${iconColorClass} transition-all duration-200 hover:scale-110 cursor-pointer`}>
                    <FiMapPin />
                  </button>
                  <button
                    onClick={() => setShowSearchBar((prev) => !prev)}
                    className={`w-5 h-5 ${iconColorClass} transition-all duration-200 hover:scale-110 cursor-pointer`}
                    aria-label="Toggle search bar">
                    <FiSearch />
                  </button>
                </div>

                {/* Menu central */}
                <nav className="flex items-center space-x-12">
                  <Link
                    href="/"
                    className={`relative text-sm font-thin ${textColorClass} hover:text-gray-200 tracking-wide transition-all duration-200 group`}>
                    HOME
                    <span
                      className={`absolute bottom-0 left-0 w-0 h-0.5 ${underlineColorClass} transition-all duration-300 group-hover:w-full`}></span>
                  </Link>

                  <div
                    className="relative"
                    onMouseEnter={() => handleMenuEnter("produtos")}
                    onMouseLeave={handleMenuLeave}>
                    <button
                      onClick={() => toggleItem("produtos")}
                      className={`relative text-sm font-thin ${textColorClass} hover:text-gray-200 tracking-wide transition-all duration-200 group ${
                        openMenu === "produtos" ? "border-b-2 border-white" : ""
                      }`}>
                      PRODUTOS
                      <span
                        className={`absolute bottom-0 left-0 w-0 h-0.5 ${underlineColorClass} transition-all duration-300 group-hover:w-full`}></span>
                    </button>
                  </div>

                  <div
                    className="relative"
                    onMouseEnter={() => handleMenuEnter("institucional")}
                    onMouseLeave={handleMenuLeave}>
                    <button
                      onClick={() => toggleItem("institucional")}
                      className={`relative text-sm font-thin ${textColorClass} hover:text-gray-200 tracking-wide transition-all duration-200 group ${
                        openMenu === "institucional"
                          ? "border-b-2 border-white"
                          : ""
                      }`}>
                      INSTITUCIONAL
                      <span
                        className={`absolute bottom-0 left-0 w-0 h-0.5 ${underlineColorClass} transition-all duration-300 group-hover:w-full`}></span>
                    </button>
                  </div>

                  <div
                    className="relative"
                    onMouseEnter={() => handleMenuEnter("blog")}
                    onMouseLeave={handleMenuLeave}>
                    <button
                      onClick={() => toggleItem("blog")}
                      className={`relative text-sm font-thin ${textColorClass} hover:text-gray-200 tracking-wide transition-all duration-200 group ${
                        openMenu === "blog" ? "border-b-2 border-white" : ""
                      }`}>
                      BLOG
                      <span
                        className={`absolute bottom-0 left-0 w-0 h-0.5 ${underlineColorClass} transition-all duration-300 group-hover:w-full`}></span>
                    </button>
                  </div>

                  <div
                    className="relative"
                    onMouseEnter={() => handleMenuEnter("sale")}
                    onMouseLeave={handleMenuLeave}>
                    <button
                      onClick={() => toggleItem("sale")}
                      className={`relative text-sm font-thin ${textColorClass} hover:text-gray-200 tracking-wide transition-all duration-200 group ${
                        openMenu === "sale" ? "border-b-2 border-white" : ""
                      }`}>
                      SALE
                      <span
                        className={`absolute bottom-0 left-0 w-0 h-0.5 ${underlineColorClass} transition-all duration-300 group-hover:w-full`}></span>
                    </button>
                  </div>
                </nav>

                {/* Ícones da direita */}
                <div className="flex items-center space-x-6">
                  <Link
                    href="/account"
                    className={`w-5 h-5 ${iconColorClass} transition-all duration-200 hover:scale-110`}>
                    <FiUser />
                  </Link>
                  <button
                    className={`w-5 h-5 ${iconColorClass} transition-all duration-200 hover:scale-110 cursor-pointer`}>
                    <FiHeart />
                  </button>
                  <button
                    type="button"
                    onClick={toggleCart}
                    className={`relative w-5 h-5 ${iconColorClass} transition-all duration-200 hover:scale-110 cursor-pointer`}>
                    <FiShoppingBag />
                    {mounted && getTotalItems() > 0 && (
                      <span
                        suppressHydrationWarning
                        className="absolute z-50 -top-2 -right-2 bg-yellow-800 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center animate-pulse">
                        {getTotalItems()}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Layout quando scrolled - Logo ao lado - Hidden on mobile */}
          {effectiveScrolled && (
            <div className="hidden lg:flex items-center justify-between py-4">
              {/* Ícones da esquerda */}
              <div className="flex items-center space-x-6">
                <button
                  className={`w-5 h-5 ${iconColorClass} transition-all duration-200 hover:scale-110 cursor-pointer`}>
                  <FiMapPin />
                </button>
                <button
                  onClick={() => setShowSearchBar((prev) => !prev)}
                  className={`w-5 h-5 ${iconColorClass} transition-all duration-200 hover:scale-110 cursor-pointer`}
                  aria-label="Toggle search bar">
                  <FiSearch />
                </button>
              </div>

              {/* Logo e Menu na mesma linha */}
              <div className="flex items-center space-x-12">
                <Link href="/" className="flex items-center">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-200">
                    <span className="text-white text-sm font-bold tracking-wider">
                      nem
                    </span>
                  </div>
                </Link>

                <nav className="flex items-center space-x-8">
                  <Link
                    href="/"
                    className={`relative text-sm font-medium ${textColorClass} hover:text-sky-950 tracking-wide transition-all duration-200 group`}>
                    HOME
                    <span
                      className={`absolute bottom-0 left-0 w-0 h-0.5 ${underlineColorClass} transition-all duration-300 group-hover:w-full`}></span>
                  </Link>

                  <div
                    className="relative"
                    onMouseEnter={() => handleMenuEnter("produtos")}
                    onMouseLeave={handleMenuLeave}>
                    <button
                      onClick={() => toggleItem("produtos")}
                      className={`relative text-sm font-medium ${textColorClass} hover:text-sky-950 tracking-wide transition-all duration-200 group ${
                        openMenu === "produtos"
                          ? "border-b-2 border-sky-950"
                          : ""
                      }`}>
                      PRODUTOS
                      <span
                        className={`absolute bottom-0 left-0 w-0 h-0.5 ${underlineColorClass} transition-all duration-300 group-hover:w-1/6`}></span>
                    </button>
                  </div>

                  <div
                    className="relative"
                    onMouseEnter={() => handleMenuEnter("institucional")}
                    onMouseLeave={handleMenuLeave}>
                    <button
                      onClick={() => toggleItem("institucional")}
                      className={`relative text-sm font-medium ${textColorClass} hover:text-sky-950tracking-wide transition-all duration-200 group ${
                        openMenu === "institucional"
                          ? "border-b-2 border-sky-950"
                          : ""
                      }`}>
                      INSTITUCIONAL
                      <span
                        className={`absolute bottom-0 left-0 w-0 h-0.5 ${underlineColorClass} transition-all duration-300 group-hover:w-1/6`}></span>
                    </button>
                  </div>

                  <div
                    className="relative"
                    onMouseEnter={() => handleMenuEnter("blog")}
                    onMouseLeave={handleMenuLeave}>
                    <button
                      onClick={() => toggleItem("blog")}
                      className={`relative text-sm font-medium ${textColorClass} hover:text-sky-950 tracking-wide transition-all duration-200 group ${
                        openMenu === "blog" ? "border-b-2 border-sky-950" : ""
                      }`}>
                      BLOG
                      <span
                        className={`absolute bottom-0 left-0 w-0 h-0.5 ${underlineColorClass} transition-all duration-300 group-hover:w-1/6`}></span>
                    </button>
                  </div>

                  <div
                    className="relative"
                    onMouseEnter={() => handleMenuEnter("sale")}
                    onMouseLeave={handleMenuLeave}>
                    <button
                      onClick={() => toggleItem("sale")}
                      className={`relative text-sm font-medium ${textColorClass} hover:text-sky-950 tracking-wide transition-all duration-200 group ${
                        openMenu === "sale" ? "border-b-2 border-sky-950" : ""
                      }`}>
                      SALE
                      <span
                        className={`absolute bottom-0 left-0 w-0 h-0.5 ${underlineColorClass} transition-all duration-300 group-hover:w-1/6`}></span>
                    </button>
                  </div>
                </nav>
              </div>

              {/* Ícones da direita */}
              <div className="flex items-center space-x-6">
                <Link
                  href="/account"
                  className={`w-5 h-5 ${iconColorClass} transition-all duration-200 hover:scale-110`}>
                  <FiUser />
                </Link>
                <button
                  className={`w-5 h-5 ${iconColorClass} transition-all duration-200 hover:scale-110 cursor-pointer`}>
                  <FiHeart />
                </button>
                <button
                  type="button"
                  onClick={toggleCart}
                  className={`relative w-5 h-5 ${iconColorClass} transition-all duration-200 hover:scale-110 cursor-pointer`}>
                  <FiShoppingBag />
                  {mounted && getTotalItems() > 0 && (
                    <span
                      suppressHydrationWarning
                      className="absolute z-50 -top-2 -right-2 bg-blue-900 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center animate-pulse">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Layout Mobile/Tablet - Sempre visível em telas menores que lg */}
          <div className="lg:hidden flex items-center justify-between py-2.5">
            {/* Logo à esquerda */}
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-200">
                <span className="text-white text-xs sm:text-sm font-bold tracking-wider">
                  nem
                </span>
              </div>
            </Link>

            {/* Ícones da direita */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => setShowSearchBar((prev) => !prev)}
                className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColorClass} transition-all duration-200 hover:scale-110 cursor-pointer`}
                aria-label="Toggle search bar">
                <FiSearch />
              </button>
              <Link
                href="/account"
                className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColorClass} transition-all duration-200 hover:scale-110`}>
                <FiUser />
              </Link>
              <button
                className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColorClass} transition-all duration-200 hover:scale-110 cursor-pointer`}>
                <FiHeart />
              </button>
              <button
                type="button"
                onClick={toggleCart}
                className={`relative w-4 h-4 sm:w-5 sm:h-5 ${iconColorClass} transition-all duration-200 hover:scale-110 cursor-pointer`}>
                <FiShoppingBag />
                {mounted && getTotalItems() > 0 && (
                  <span
                    suppressHydrationWarning
                    className="absolute z-50 -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-blue-900 text-white rounded-full text-xs w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center animate-pulse">
                    {getTotalItems()}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColorClass} transition-all duration-200 hover:scale-110 cursor-pointer ml-1`}
                aria-label="Toggle mobile menu">
                {mobileOpen ? <FiX /> : <FiMenu />}
              </button>
            </div>
          </div>
        </div>

        {/* Barra de busca */}
        <div
          className={`border-t border-gray-100 bg-white bg-opacity-95 backdrop-blur-sm transition-all duration-300 ease-in-out ${
            showSearchBar
              ? "max-h-20 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}>
          <form
            onSubmit={handleSearch}
            className="container mx-auto flex items-center justify-center py-3 sm:py-4 px-3 sm:px-4">
            <div className="relative w-full max-w-xl flex items-center">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-gray-800 text-sm sm:text-base transition-all duration-200"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-sky-950 text-white p-1.5 sm:p-2 rounded-full hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Confirm search">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* Submenu Desktop - posicionado logo abaixo do header */}
        {openMenu && (
          <div
            className="hidden lg:block absolute left-0 right-0 top-full bg-white bg-opacity-95 backdrop-blur-sm shadow-xl border-t border-gray-100 z-40"
            onMouseEnter={handleSubmenuEnter}
            onMouseLeave={handleSubmenuLeave}>
            <div className="container mx-auto px-4 py-8">
              {openMenu === "produtos" && (
                <div className="flex justify-between items-start">
                  {/* Seção de categorias organizadas em duas colunas */}
                  <div className="flex-1 flex">
                    {/* Primeira coluna - CATEGORIAS */}
                    <div className="flex-1 pr-8">
                      <h3 className="font-semibold text-sm text-gray-900 mb-6 tracking-wide">
                        CATEGORIAS
                      </h3>
                      <div className="space-y-2">
                        <Link
                          href="/products"
                          className="block py-1 font-semibold text-sm text-gray-900 hover:text-blue-900 transition-colors duration-200 mb-4 relative group">
                          Ver Todos os Produtos
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-900 transition-all duration-300 group-hover:w-1/6"></span>
                        </Link>
                        {productCategories
                          .slice(0, Math.ceil(productCategories.length / 2))
                          .map((category) => (
                            <Link
                              key={category}
                              href={`/products?category=${encodeURIComponent(
                                category.toLowerCase().replace(/\s+/g, "-")
                              )}`}
                              className="block py-1 text-sm text-gray-700 hover:text-blue-900 transition-colors duration-200 uppercase relative group">
                              {category}
                              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-900 transition-all duration-300 group-hover:w-1/6"></span>
                            </Link>
                          ))}
                      </div>
                    </div>

                    {/* Segunda coluna - LINHAS */}
                    <div className="flex-1 pr-8">
                      <h3 className="font-semibold text-sm text-gray-900 mb-6 tracking-wide">
                        LINHAS
                      </h3>
                      <div className="space-y-2">
                        {productCategories
                          .slice(Math.ceil(productCategories.length / 2))
                          .map((category) => (
                            <Link
                              key={category}
                              href={`/products?category=${encodeURIComponent(
                                category.toLowerCase().replace(/\s+/g, "-")
                              )}`}
                              className="block py-1 text-sm text-gray-700 hover:text-blue-900 transition-colors duration-200 uppercase relative group">
                              {category}
                              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-900 transition-all duration-300 group-hover:w-1/6"></span>
                            </Link>
                          ))}
                        <Link
                          href="/products/ver-tudo"
                          className="block py-1 text-sm font-medium text-black hover:text-blue-900 hover:underline mt-4 relative group">
                          VER TUDO &gt;
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-900 transition-all duration-300 group-hover:w-1/6"></span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Imagem promocional - replicando o layout da Animale */}
                  <div className="ml-8 w-80 h-64 relative overflow-hidden rounded-lg shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-amber-50 to-green-100">
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-80"
                        style={{
                          backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f5f5dc"/><rect x="50" y="50" width="80" height="200" fill="%23deb887" opacity="0.3"/><rect x="150" y="30" width="100" height="240" fill="%23d2b48c" opacity="0.4"/><rect x="270" y="70" width="80" height="160" fill="%23bc9a6a" opacity="0.3"/></svg>')`,
                        }}></div>
                      <div className="absolute bottom-8 left-8 text-white">
                        <div className="text-2xl font-light tracking-[0.2em] mb-2 drop-shadow-lg">
                          NEM OÁSIS
                        </div>
                        <div className="text-sm opacity-90">Nova Coleção</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {openMenu === "institucional" && (
                <div className="grid grid-cols-4 gap-8">
                  {institucional.map((item) => (
                    <Link
                      key={item}
                      href={slug(item)}
                      className="block py-2 text-sm text-gray-700 hover:text-blue-900 transition-colors duration-200 relative group">
                      {item}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-900 transition-all duration-300 group-hover:w-1/6"></span>
                    </Link>
                  ))}
                </div>
              )}

              {openMenu === "blog" && (
                <div className="grid grid-cols-4 gap-8">
                  {blog.map((item) => (
                    <Link
                      key={item}
                      href={slug(item)}
                      className="block py-2 text-sm text-gray-700 hover:text-blue-900 transition-colors duration-200 relative group">
                      {item}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-900 transition-all duration-300 group-hover:w-1/6"></span>
                    </Link>
                  ))}
                </div>
              )}

              {openMenu === "sale" && (
                <div className="flex justify-between items-start">
                  <div className="flex-1 grid grid-cols-3 gap-8">
                    {sale.map((item) => (
                      <Link
                        key={item}
                        href={slug(item)}
                        className="block py-2 text-sm text-gray-700 hover:text-blue-900 transition-colors duration-200 relative group">
                        {item}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-900 transition-all duration-300 group-hover:w-1/6"></span>
                      </Link>
                    ))}
                  </div>
                  {/* Imagem promocional para Sale */}
                  <div className="ml-8 w-64 h-40 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center text-sm text-red-800 shadow-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-2">SALE</div>
                      <div className="text-xs">ATÉ 70% OFF</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Menu Mobile */}
      <div
        className={`lg:hidden bg-white bg-opacity-95 backdrop-blur-sm border-t border-gray-100 transition-all duration-300 ease-in-out ${
          mobileOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}>
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 space-y-1 max-h-80 sm:max-h-96 overflow-y-auto">
          <Link
            href="/"
            className="block py-2.5 sm:py-3 text-sm sm:text-base font-medium text-gray-800 hover:text-blue-900 transition-colors duration-200 border-b border-gray-100"
            onClick={() => setMobileOpen(false)}>
            HOME
          </Link>

          {/* PRODUTOS com submenu */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => toggleMobileSubmenu("produtos")}
              className="w-full flex items-center justify-between py-2.5 sm:py-3 text-sm sm:text-base font-medium text-gray-800 hover:text-blue-900 transition-colors duration-200">
              PRODUTOS
              <FiChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  mobileSubmenuOpen === "produtos" ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                mobileSubmenuOpen === "produtos" ? "max-h-80 pb-2" : "max-h-0"
              }`}>
              <Link
                href="/products"
                className="block py-2 pl-4 text-sm font-medium text-gray-900 hover:text-sky-950 transition-colors duration-200"
                onClick={() => setMobileOpen(false)}>
                Ver Todos os Produtos
              </Link>
              {productCategories.map((category) => (
                <Link
                  key={category}
                  href={`/products?category=${encodeURIComponent(
                    category.toLowerCase().replace(/\s+/g, "-")
                  )}`}
                  className="block py-1.5 pl-4 text-sm text-gray-700 hover:text-sky-950 transition-colors duration-200"
                  onClick={() => setMobileOpen(false)}>
                  {category}
                </Link>
              ))}
            </div>
          </div>

          {/* INSTITUCIONAL com submenu */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => toggleMobileSubmenu("institucional")}
              className="w-full flex items-center justify-between py-2.5 sm:py-3 text-sm sm:text-base font-medium text-gray-800 hover:text-sky-950 transition-colors duration-200">
              INSTITUCIONAL
              <FiChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  mobileSubmenuOpen === "institucional" ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                mobileSubmenuOpen === "institucional"
                  ? "max-h-80 pb-2"
                  : "max-h-0"
              }`}>
              {institucional.map((item) => (
                <Link
                  key={item}
                  href={slug(item)}
                  className="block py-1.5 pl-4 text-sm text-gray-700 hover:text-blue-900 transition-colors duration-200"
                  onClick={() => setMobileOpen(false)}>
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* BLOG com submenu */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => toggleMobileSubmenu("blog")}
              className="w-full flex items-center justify-between py-2.5 sm:py-3 text-sm sm:text-base font-medium text-gray-800 hover:text-sky-950 transition-colors duration-200">
              BLOG
              <FiChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  mobileSubmenuOpen === "blog" ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                mobileSubmenuOpen === "blog" ? "max-h-80 pb-2" : "max-h-0"
              }`}>
              {blog.map((item) => (
                <Link
                  key={item}
                  href={slug(item)}
                  className="block py-1.5 pl-4 text-sm text-gray-700 hover:text-sky-950 transition-colors duration-200"
                  onClick={() => setMobileOpen(false)}>
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* SALE com submenu */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => toggleMobileSubmenu("sale")}
              className="w-full flex items-center justify-between py-2.5 sm:py-3 text-sm sm:text-base font-medium text-grsky-950 text-sky-950 transition-colors duration-200">
              SALE
              <FiChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  mobileSubmenuOpen === "sale" ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                mobileSubmenuOpen === "sale" ? "max-h-80 pb-2" : "max-h-0"
              }`}>
              {sale.map((item) => (
                <Link
                  key={item}
                  href={slug(item)}
                  className="block py-1.5 pl-4 text-sm text-gray-700 hover:text-sky-950 transition-colors duration-200"
                  onClick={() => setMobileOpen(false)}>
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
