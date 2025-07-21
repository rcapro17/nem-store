"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const CategoryCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRef = useRef(null);

  // Categorias da loja NEM inspiradas no estilo Mamo
  const categories = [
    {
      id: 1,
      name: "Blusas",
      slug: "blusas",
      image: "/images/nem_blusas.jpg",
      description: "Elegância e sofisticação",
    },
    {
      id: 2,
      name: "Casacos",
      slug: "casacos",
      image: "/images/nem_3248.jpg",
      description: "Estilo para todas as estações",
    },
    {
      id: 3,
      name: "Calças",
      slug: "calcas",
      image: "/images/nem_calcas.jpg",
      description: "Versatilidade e conforto",
    },
    {
      id: 4,
      name: "Camisas",
      slug: "camisas",
      image: "/images/nem_camisas.jpg",
      description: "Clássicas e atemporais",
    },
    {
      id: 5,
      name: "Pantalona",
      slug: "pantalona",
      image: "/images/nem_pantalona.jpg",
      description: "Movimento e fluidez",
    },
    {
      id: 6,
      name: "Saias",
      slug: "saias",
      image: "/images/nem_vestidos.jpg",
      description: "Feminilidade em cada detalhe",
    },
  ];

  // Intersection Observer para animação de scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Auto-play do carrossel com transição suave
  useEffect(() => {
    const interval = setInterval(() => {
      handleSlideChange((prevIndex) =>
        prevIndex === categories.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000); // Aumentado para 6 segundos

    return () => clearInterval(interval);
  }, [categories.length]);

  // Função para mudança suave de slide
  const handleSlideChange = (newIndexOrFunction) => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    if (typeof newIndexOrFunction === "function") {
      setCurrentIndex(newIndexOrFunction);
    } else {
      setCurrentIndex(newIndexOrFunction);
    }

    // Reset da transição após animação
    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  };

  const nextSlide = () => {
    const newIndex =
      currentIndex === categories.length - 1 ? 0 : currentIndex + 1;
    handleSlideChange(newIndex);
  };

  const prevSlide = () => {
    const newIndex =
      currentIndex === 0 ? categories.length - 1 : currentIndex - 1;
    handleSlideChange(newIndex);
  };

  const goToSlide = (index) => {
    if (index !== currentIndex) {
      handleSlideChange(index);
    }
  };

  // Função para obter os índices dos cards visíveis
  const getVisibleCards = () => {
    const prevIndex =
      (currentIndex - 1 + categories.length) % categories.length;
    const nextIndex = (currentIndex + 1) % categories.length;
    return { prevIndex, currentIndex, nextIndex };
  };

  const { prevIndex, nextIndex } = getVisibleCards();

  return (
    <section
      ref={sectionRef}
      className="py-8 sm:py-16 lg:py-24 bg-gradient-to-br from-yellow-50 via-gray-400 to-yellow-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título com animação inspirado na Mamo */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-20">
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-light text-yellow-800 mb-4 sm:mb-6 transition-all duration-1000 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
            style={{
              fontFamily: "Dancing Script, cursive",
              letterSpacing: "0.02em",
            }}>
            Ache o que você está procurando
          </h2>
          <div
            className={`w-24 sm:w-32 h-0.5 bg-gradient-to-r from-sky-950 to-white mx-auto transition-all duration-1000 delay-300 ${
              isVisible ? "scale-x-100" : "scale-x-0"
            }`}
          />
        </div>

        {/* Carrossel Principal - Mobile Friendly */}
        <div className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] min-h-[400px] max-h-[800px] flex items-center justify-center">
          {/* Card Anterior (Esquerda) - Mais sobreposto */}
          <div className="absolute left-2 sm:left-8 lg:left-16 top-1/2 transform -translate-y-1/2 z-20">
            <Link
              href={`/products?category=${categories[prevIndex].slug}`}
              className="block w-[120px] h-[180px] sm:w-[160px] sm:h-[240px] lg:w-[200px] lg:h-[300px] group"
              onClick={(e) => {
                e.preventDefault();
                prevSlide();
              }}>
              <div
                className={`relative w-full h-full rounded-xl lg:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-800 ease-out transform hover:scale-105 ${
                  isTransitioning
                    ? "scale-95 opacity-60"
                    : "opacity-80 hover:opacity-95"
                }`}>
                <Image
                  src={categories[prevIndex].image}
                  alt={categories[prevIndex].name}
                  fill
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                  sizes="(max-width: 640px) 120px, (max-width: 1024px) 160px, 200px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-2 sm:bottom-3 lg:bottom-4 left-2 sm:left-3 lg:left-4 right-2 sm:right-3 lg:right-4">
                  <h3
                    className="text-white text-sm sm:text-base lg:text-xl font-bold mb-1"
                    style={{ fontFamily: "Dancing Script, cursive" }}>
                    {categories[prevIndex].name}
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm hidden sm:block">
                    {categories[prevIndex].description}
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Card Principal (Centro) - IMPONENTE e Mobile Friendly */}
          <div className="relative z-30 mx-4 sm:mx-8">
            <Link
              href={`/products?category=${categories[currentIndex].slug}`}
              className="block w-[280px] h-[400px] sm:w-[350px] sm:h-[500px] lg:w-[500px] lg:h-[650px] xl:w-[600px] xl:h-[750px] group">
              <div
                className={`relative w-full h-full rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-1000 ease-out transform hover:scale-[1.02] ${
                  isTransitioning ? "scale-98" : ""
                }`}>
                <Image
                  src={categories[currentIndex].image}
                  alt={categories[currentIndex].name}
                  fill
                  className="object-cover transition-transform duration-1200 ease-out group-hover:scale-110"
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 350px, (max-width: 1280px) 500px, 600px"
                  priority
                />
                {/* Overlay gradiente dramático */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-pink-600/20 group-hover:from-purple-600/30 group-hover:to-pink-600/30 transition-all duration-1000" />

                {/* Borda brilhante */}
                <div className="absolute inset-0 rounded-2xl lg:rounded-3xl border-2 border-white/40 pointer-events-none"></div>

                {/* Conteúdo do card principal */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 xl:p-12">
                  <div className="transform transition-all duration-800 ease-out group-hover:translate-y-[-16px]">
                    <h3
                      className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-3 lg:mb-4 drop-shadow-2xl"
                      style={{ fontFamily: "Dancing Script, cursive" }}>
                      {categories[currentIndex].name}
                    </h3>
                    <p className="text-white/90 text-sm sm:text-base lg:text-lg xl:text-xl font-light drop-shadow-lg mb-4 sm:mb-6 lg:mb-8">
                      {categories[currentIndex].description}
                    </p>

                    {/* Botão de ação principal */}
                    <div className="inline-flex items-center px-4 sm:px-6 lg:px-8 xl:px-10 py-2 sm:py-3 lg:py-4 xl:py-5 bg-white/25 backdrop-blur-md border border-white/40 rounded-full text-white text-sm sm:text-base lg:text-lg font-medium group-hover:bg-white/35 group-hover:border-white/60 transition-all duration-800 ease-out">
                      <span>Explorar</span>
                      <FiChevronRight className="ml-2 lg:ml-3 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 transform group-hover:translate-x-1 transition-transform duration-800" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Card Seguinte (Direita) - Mais sobreposto */}
          <div className="absolute right-2 sm:right-8 lg:right-16 top-1/2 transform -translate-y-1/2 z-20">
            <Link
              href={`/products?category=${categories[nextIndex].slug}`}
              className="block w-[120px] h-[180px] sm:w-[160px] sm:h-[240px] lg:w-[200px] lg:h-[300px] group"
              onClick={(e) => {
                e.preventDefault();
                nextSlide();
              }}>
              <div
                className={`relative w-full h-full rounded-xl lg:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-800 ease-out transform hover:scale-105 ${
                  isTransitioning
                    ? "scale-95 opacity-60"
                    : "opacity-80 hover:opacity-95"
                }`}>
                <Image
                  src={categories[nextIndex].image}
                  alt={categories[nextIndex].name}
                  fill
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                  sizes="(max-width: 640px) 120px, (max-width: 1024px) 160px, 200px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-2 sm:bottom-3 lg:bottom-4 left-2 sm:left-3 lg:left-4 right-2 sm:right-3 lg:right-4">
                  <h3
                    className="text-white text-sm sm:text-base lg:text-xl font-bold mb-1"
                    style={{ fontFamily: "Dancing Script, cursive" }}>
                    {categories[nextIndex].name}
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm hidden sm:block">
                    {categories[nextIndex].description}
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Botões de navegação - Mobile Friendly */}
          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className="absolute left-1 sm:left-2 lg:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 p-2 sm:p-3 lg:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-500 ease-out z-40 group disabled:opacity-50"
            aria-label="Categoria anterior">
            <FiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 transform group-hover:scale-110 transition-transform duration-300" />
          </button>

          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className="absolute right-1 sm:right-2 lg:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 p-2 sm:p-3 lg:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-500 ease-out z-40 group disabled:opacity-50"
            aria-label="Próxima categoria">
            <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 transform group-hover:scale-110 transition-transform duration-300" />
          </button>
        </div>

        {/* Indicadores de posição - Mobile Friendly */}
        <div className="flex justify-center mt-8 sm:mt-12 space-x-2 sm:space-x-4">
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`rounded-full transition-all duration-500 ease-out disabled:opacity-50 ${
                index === currentIndex
                  ? "w-8 sm:w-12 h-2 sm:h-3 bg-gradient-to-r from-sky-950 to-cyan-400"
                  : "w-2 sm:w-3 h-2 sm:h-3 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Ir para categoria ${index + 1}`}
            />
          ))}
        </div>

        {/* Call to action - Mobile Friendly */}
        <div className="text-center mt-12 sm:mt-16">
          <Link
            href="/products"
            className="inline-flex items-center px-8 sm:px-10 lg:px-12 py-3 sm:py-4 lg:py-5 bg-gradient-to-r from-sky-950 via-sky-700 to-sky-950 hover:from-stone-600 hover:to-yellow-600 text-white font-medium rounded-full transition-all duration-500 ease-out transform hover:scale-105 shadow-lg hover:shadow-xl">
            <span
              style={{ fontFamily: "Dancing Script, cursive" }}
              className="text-lg sm:text-xl lg:text-2xl">
              Ver Toda a Coleção
            </span>
            <FiChevronRight className="ml-2 sm:ml-3 w-5 h-5 sm:w-6 sm:h-6" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryCarousel;
