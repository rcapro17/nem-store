"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

/**
 * ScrollRevealSection
 *
 * A section that animates an image in from the left
 * and text in from the right when it scrolls into view.
 *
 * Props:
 * - imageSrc: string (path or URL to the image)
 * - altText: string (alt attribute for the image)
 * - title: string (heading above the content)
 * - children: ReactNode (paragraph(s) of descriptive text)
 * - buttonText: string (optional - text for the CTA button)
 * - buttonLink: string (optional - link for the CTA button, defaults to /products)
 */
export default function ScrollRevealSection({
  imageSrc,
  altText,
  title,
  children,
  buttonText = "Explorar Produtos",
  buttonLink = "/products",
}) {
  return (
    <section className="py-16 lg:py-24 bg-[#948979] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Image (slides in from the left) */}
          <motion.div
            className="w-full lg:w-1/2 overflow-hidden"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}>
            <div className="relative group">
              <Image
                src={imageSrc}
                alt={altText}
                width={700}
                height={700}
                className="w-full h-auto rounded-2xl shadow-2xl transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Overlay sutil para profundidade */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>
          </motion.div>

          {/* Text Content (slides in from the right) */}
          <motion.div
            className="w-full lg:w-1/2 flex flex-col justify-center"
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}>
            {/* Título Moderno */}
            {title && (
              <motion.h2
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-white mb-6 lg:mb-8 leading-tight tracking-wide"
                style={{ fontFamily: "Dancing Script, cursive" }}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                viewport={{ once: true }}>
                {title}
              </motion.h2>
            )}

            {/* Conteúdo de Texto Maior */}
            <motion.div
              className="space-y-6 lg:space-y-8 text-white/90 mb-8 lg:mb-12"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
              viewport={{ once: true }}>
              <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-light leading-relaxed">
                {children}
              </div>
            </motion.div>

            {/* Botão CTA Vazado */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
              viewport={{ once: true }}>
              <Link
                href={buttonLink}
                className="group inline-flex items-center">
                <div className="relative overflow-hidden">
                  <div className="flex items-center px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 border-2 border-white/60 hover:border-white rounded-full transition-all duration-500 ease-out hover:bg-white/10 backdrop-blur-sm">
                    <span className="text-white text-base sm:text-lg lg:text-xl font-medium tracking-wide group-hover:tracking-wider transition-all duration-300">
                      {buttonText}
                    </span>
                    <FiArrowRight className="ml-3 sm:ml-4 w-5 h-5 sm:w-6 sm:h-6 text-white transform group-hover:translate-x-2 transition-transform duration-300" />
                  </div>

                  {/* Efeito de brilho no hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                </div>
              </Link>
            </motion.div>

            {/* Elemento decorativo */}
            <motion.div
              className="mt-8 lg:mt-12"
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
              viewport={{ once: true }}>
              <div className="w-24 sm:w-32 lg:w-40 h-0.5 bg-gradient-to-r from-white/60 to-transparent"></div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
