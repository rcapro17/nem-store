// components/InfoLinks.jsx
import Link from "next/link";
import { FiGift, FiCreditCard, FiPercent, FiTruck } from "react-icons/fi";

export default function InfoLinks() {
  const items = [
    {
      icon: <FiGift className="w-8 h-8 sm:w-10 sm:h-10" />,
      title: "BENEFÍCIOS ESPECIAIS",
      subtitle: "cadastre-se e ganhe",
      description: "cupons exclusivos",
      href: "/products",
    },
    {
      icon: <FiCreditCard className="w-8 h-8 sm:w-10 sm:h-10" />,
      title: "APPLE PAY",
      subtitle: "garanta seus",
      description: "favoritos",
      href: "/products",
    },
    {
      icon: <FiPercent className="w-8 h-8 sm:w-10 sm:h-10" />,
      title: "PARCELAMENTO SEM JUROS",
      subtitle: "até 6x: parcela mínima de R$ 248",
      description: "de 9 a 12x: parcela mínima de R$ 648",
      href: "/products",
    },
    {
      icon: <FiTruck className="w-8 h-8 sm:w-10 sm:h-10" />,
      title: "FRETE GRÁTIS",
      subtitle: "acima de R$2000 com",
      description: "cód. ANML ou de vendedor",
      href: "/products",
    },
  ];

  return (
    <div className="w-full bg-gradient-to-r from-sky-950 via-black to-sky-950">
      {/* Grid responsivo sem container limitador */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <Link
            key={item.title}
            href={item.href}
            className="group block hover:bg-black/10 transition-all duration-300">
            <div
              className={`
              relative px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 text-center text-amber-50
              ${
                index < items.length - 1 ? "lg:border-r lg:border-white/20" : ""
              }
              ${index < 2 ? "sm:border-r sm:border-white/20 lg:border-r-0" : ""}
              ${index === 2 ? "lg:border-r lg:border-white/20" : ""}
            `}>
              {/* Ícone */}
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
              </div>

              {/* Título principal */}
              <h3 className="font-semibold text-sm sm:text-base lg:text-lg xl:text-xl tracking-wide mb-2 sm:mb-3 leading-tight">
                {item.title}
              </h3>

              {/* Subtítulo */}
              <p className="text-xs sm:text-sm lg:text-base opacity-90 mb-1 leading-relaxed">
                {item.subtitle}
              </p>

              {/* Descrição */}
              <p className="text-xs sm:text-sm lg:text-base opacity-90 leading-relaxed">
                {item.description}
              </p>

              {/* Efeito hover */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300 pointer-events-none"></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
