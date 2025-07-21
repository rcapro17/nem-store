// components/PageHero.jsx
"use client";

import { useRouter } from "next/router";

export default function PageHero({
  title,
  description,
  customTitle,
  customDescription,
}) {
  const router = useRouter();

  // Função para determinar o título baseado na categoria ou rota
  const getTitle = () => {
    if (customTitle) return customTitle;

    const { category } = router.query;

    if (category) {
      // Mapear categorias para títulos amigáveis
      const categoryTitles = {
        roupas: "Roupas",
        vestidos: "Vestidos",
        blusas: "Blusas",
        calcas: "Calças",
        saias: "Saias",
        casacos: "Casacos",
        acessorios: "Acessórios",
      };
      return (
        categoryTitles[category] ||
        category.charAt(0).toUpperCase() + category.slice(1)
      );
    }

    if (router.pathname === "/products") {
      return "Todos os Produtos";
    }

    if (router.pathname.includes("/product/")) {
      return "Produto";
    }

    return title || "NEM Store";
  };

  const getDescription = () => {
    if (customDescription) return customDescription;

    const { category } = router.query;

    if (category) {
      return `Descubra nossa coleção exclusiva de ${getTitle().toLowerCase()}. Peças únicas, modernas e cheias de estilo para você arrasar em qualquer ocasião.`;
    }

    if (router.pathname === "/products") {
      return "Explore nossa coleção completa de moda feminina. Peças exclusivas, tendências atuais e muito estilo para você se destacar.";
    }

    if (router.pathname.includes("/product/")) {
      return "Conheça todos os detalhes deste produto exclusivo da NEM Store.";
    }

    return description || "Moda feminina exclusiva e cheia de estilo.";
  };

  return (
    <section
      className="relative py-16"
      style={{
        backgroundImage: "url('/images/page_hero_bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Conteúdo */}
      <div className="relative max-w-3xl mx-auto px-10 sm:px-6 lg:px-8 text-center mt-40 text-slate-50">
        <h1 className="text-5xl md:text-7xl font-dancing-script font-bold mb-4">
          {getTitle()}
        </h1>
        <p className="text-xl text-amber-100 max-w-3xl mx-auto font-poppins">
          {getDescription()}
        </p>
      </div>
    </section>
  );
}
