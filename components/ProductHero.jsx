// components/ProductHero.jsx (Sem Alterações - Já está correto)
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ProductHero() {
  const router = useRouter();
  const [title, setTitle] = useState("Todos os Produtos");

  useEffect(() => {
    const { category, search } = router.query;
    if (category) {
      setTitle(decodeURIComponent(category));
    } else if (search) {
      setTitle(`Resultados para "${decodeURIComponent(search)}"`);
    } else {
      setTitle("Todos os Produtos");
    }
  }, [router.query.category, router.query.search]);

  return (
    <section
      className="fixed left-0 w-full h-[10vh] min-h-[200px] flex items-center justify-center text-center z-40"
      style={{
        top: "64px", // Altura do header em mobile (h-16)
        backgroundColor: "rgba(220, 197, 178, 50)", // Cor #DCC5B2 com 70% de opacidade
      }}>
      <style jsx>{`
        @media (min-width: 768px) {
          /* md breakpoint */
          section {
            top: 80px !important; /* Altura do header em desktop (md:h-20) */
          }
        }
      `}</style>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 drop-shadow-sm">
        {title}
      </h1>
    </section>
  );
}
