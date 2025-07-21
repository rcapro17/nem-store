/* components/Hero.jsx */
"use client";
import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Custom Navigation buttons component
const SwiperNavButtons = () => {
  const swiper = useSwiper();

  return (
    <div className="absolute left-4 right-4 sm:left-8 sm:right-8 top-1/2 flex -translate-y-1/2 justify-between z-20 pointer-events-none">
      <button
        onClick={() => swiper.slidePrev()}
        className="bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full p-3 sm:p-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 pointer-events-auto group"
        aria-label="Slide anterior">
        <FiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={() => swiper.slideNext()}
        className="bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full p-3 sm:p-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 pointer-events-auto group"
        aria-label="Próximo slide">
        <FiChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
};

// Custom Pagination component
const SwiperPagination = ({ activeIndex, totalSlides, onSlideChange }) => {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSlideChange(index)}
          className={`w-12 h-1 transition-all duration-300 ${
            index === activeIndex ? "bg-white" : "bg-white/40 hover:bg-white/60"
          }`}
          aria-label={`Ir para slide ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const videoRefs = useRef([]);

  // Dados dos slides - adapte conforme seus vídeos
  const slidesData = [
    {
      // Para vídeos verticais, use 3 vídeos lado a lado
      videos: [
        "/videos/hero-video-1c.mp4", // Vídeo esquerdo
        "/videos/hero-video-1a.mp4", // Vídeo centro
        "/videos/hero-video-1b.mp4", // Vídeo direito
      ],
      // Ou use um único vídeo horizontal
      singleVideo: "/videos/hero-video-1.mp4",
      useTripleVideo: true, // true para 3 vídeos, false para 1 vídeo
      category: "LANÇAMENTO",
      title: "VERAO 26",
      subtitle: "Moda e natureza se fundem para criar um refúgio entre tempos",
      buttonText: "EXPLORE",
      buttonLink: "/products",
    },
    {
      videos: [
        "/videos/hero-video-1c.mp4",
        "/videos/hero-video-1a.mp4",
        "/videos/hero-video-1b.mp4",
      ],
      singleVideo: "/videos/hero-video-2.mp4",
      useTripleVideo: true,
      category: "NOVA COLEÇÃO",
      title: "ESSÊNCIA URBANA",
      subtitle:
        "Descubra peças que traduzem a sofisticação do cotidiano moderno",
      buttonText: "DESCOBRIR",
      buttonLink: "/products?category=nova-colecao",
    },
    {
      videos: [
        "/videos/hero-video-1c.mp4",
        "/videos/hero-video-1a.mp4",
        "/videos/hero-video-1b.mp4",
      ],
      singleVideo: "/images/fynbos_bg.jpg",
      useTripleVideo: true, // Exemplo usando vídeo único
      category: "EXCLUSIVO",
      title: "ATEMPORAL",
      subtitle: "Elegância que transcende estações e define seu estilo único",
      buttonText: "VER COLEÇÃO",
      buttonLink: "/products?category=exclusivo",
    },
  ];

  // Controle de reprodução de vídeo
  useEffect(() => {
    const currentVideos = videoRefs.current[activeSlide];
    if (currentVideos) {
      // Pausar todos os vídeos primeiro
      videoRefs.current.forEach((slideVideos, index) => {
        if (slideVideos && index !== activeSlide) {
          slideVideos.forEach((video) => {
            if (video) {
              video.pause();
              video.currentTime = 0;
            }
          });
        }
      });

      // Reproduzir vídeos do slide ativo
      currentVideos.forEach((video) => {
        if (video) {
          video.play().catch(console.error);
        }
      });
    }
  }, [activeSlide]);

  const handleSlideChange = (index) => {
    if (swiperInstance) {
      swiperInstance.slideToLoop(index);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        slidesPerView={1}
        loop
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={1000}
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
        className="w-full h-full">
        {slidesData.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              {/* Background de vídeo */}
              <div className="absolute inset-0 w-full h-full">
                {slide.useTripleVideo ? (
                  // Layout com 3 vídeos lado a lado para vídeos verticais
                  <div className="flex w-full h-full">
                    {slide.videos.map((videoSrc, videoIndex) => (
                      <div
                        key={videoIndex}
                        className="flex-1 h-full overflow-hidden">
                        <video
                          ref={(el) => {
                            if (!videoRefs.current[index]) {
                              videoRefs.current[index] = [];
                            }
                            videoRefs.current[index][videoIndex] = el;
                          }}
                          src={videoSrc}
                          muted
                          loop
                          playsInline
                          className="w-full h-full object-cover"
                          preload="metadata"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  // Layout com vídeo único para vídeos horizontais
                  <video
                    ref={(el) => {
                      if (!videoRefs.current[index]) {
                        videoRefs.current[index] = [];
                      }
                      videoRefs.current[index][0] = el;
                    }}
                    src={slide.singleVideo}
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                    preload="metadata"
                  />
                )}
              </div>

              {/* Overlay escuro sutil */}
              <div className="absolute inset-0 bg-black/20"></div>

              {/* Conteúdo do slide - Texto na lateral esquerda */}
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-6 sm:px-8 lg:px-12">
                  <div className="max-w-xl lg:max-w-2xl">
                    {/* Categoria */}
                    <div className="mb-4 sm:mb-6">
                      <span className="text-white/90 text-sm sm:text-base font-light tracking-[0.2em] uppercase">
                        {slide.category}
                      </span>
                    </div>

                    {/* Título principal */}
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-light text-white mb-6 sm:mb-8 tracking-[0.1em] leading-tight">
                      {slide.title}
                    </h1>

                    {/* Subtítulo */}
                    <p className="text-white/90 text-base sm:text-lg lg:text-xl font-light leading-relaxed mb-8 sm:mb-12 max-w-lg">
                      {slide.subtitle}
                    </p>

                    {/* Botão CTA */}
                    <Link
                      href={slide.buttonLink}
                      className="inline-block group">
                      <div className="border border-white/60 hover:border-white px-8 sm:px-12 py-3 sm:py-4 transition-all duration-300 hover:bg-white/10 backdrop-blur-sm">
                        <span className="text-white text-sm sm:text-base font-medium tracking-[0.2em] uppercase group-hover:tracking-[0.3em] transition-all duration-300">
                          {slide.buttonText}
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Navegação customizada */}
        <SwiperNavButtons />
      </Swiper>

      {/* Paginação customizada */}
      <SwiperPagination
        activeIndex={activeSlide}
        totalSlides={slidesData.length}
        onSlideChange={handleSlideChange}
      />
    </div>
  );
}
