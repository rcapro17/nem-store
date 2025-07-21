// pages/index.js

import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import NewArrivals from "../components/NewArrivals";
import InfoLinks from "../components/InfoLinks";
import ScrollRevealSection from "../components/ScrollRevealSection";
import Cart from "../components/Cart";
import Head from "next/head";
import CategoryCarousel from "../components/CategoryCarossel";

export default function Home({ newProducts }) {
  return (
    <>
      <Head>
        <title>Nem Store • Home</title>
      </Head>
      <Header />
      {/* Removido o padding horizontal do <main> para que o Hero ocupe 100% da largura */}
      <main className="min-h-screen">
        <Hero />
        <InfoLinks />
        <CategoryCarousel />
        {/* Adicionado padding horizontal individualmente para as outras seções */}

        <ScrollRevealSection
          imageSrc="/images/nem_3257.jpg"
          altText="Modelo vestindo roupa linda"
          title="Acreditamos na Beleza Plural">
          <p>
            Acreditamos que a beleza não tem um único padrão – ela é plural,
            autêntica e pessoal.
          </p>
          <p>
            Para nós, ser Linda de Morrer vai além da estética: é um estado de
            espírito. É sobre olhar no espelho e enxergar sua própria beleza,
            exatamente como ela é – real, única e poderosa.
          </p>
        </ScrollRevealSection>
        <div className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20"></div>
        <NewArrivals products={newProducts} />
        <div />
        {/* <FeaturedProducts products={featuredProducts} /> */}
        <ScrollRevealSection
          imageSrc="/images/nem_3274.jpg"
          altText="Modelo vestindo roupa linda"
          title="Acreditamos na Beleza Plural">
          <p>
            Acreditamos que a beleza não tem um único padrão – ela é plural,
            autêntica e pessoal.
          </p>
          <p>
            Para nós, ser Linda de Morrer vai além da estética: é um estado de
            espírito. É sobre olhar no espelho e enxergar sua própria beleza,
            exatamente como ela é – real, única e poderosa.
          </p>
        </ScrollRevealSection>
      </main>
      <Footer />

      {/* Componente Cart - renderizado globalmente */}
      <Cart />
    </>
  );
}

export async function getStaticProps() {
  try {
    // Configuração da API do WooCommerce
    const wooConfig = {
      storeUrl: process.env.WOO_STORE_URL || "https://nem.com.br",
      consumerKey:
        process.env.WOO_CONSUMER_KEY ||
        "ck_acef3bf84da207d5d4deadc496a51838638588b8",
      consumerSecret:
        process.env.WOO_CONSUMER_SECRET ||
        "cs_5505e78ae3c12efb4ac9a2dc79d5c32e77415f1d",
    };

    // Função para fazer fetch da API do WooCommerce
    const fetchWooCommerceProducts = async (params = "") => {
      const auth = Buffer.from(
        `${wooConfig.consumerKey}:${wooConfig.consumerSecret}`
      ).toString("base64");

      const response = await fetch(
        `${wooConfig.storeUrl}/wp-json/wc/v3/products${params}`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`WooCommerce API error: ${response.status}`);
      }

      return await response.json();
    };

    // Buscar produtos novos (ordenados por data)
    let newProducts = [];
    try {
      newProducts = await fetchWooCommerceProducts(
        "?orderby=date&order=desc&per_page=12&status=publish"
      );
    } catch (error) {
      console.error("Erro ao buscar novos produtos:", error);
      // Fallback: produtos mock para não quebrar o build
      newProducts = [];
    }

    // Buscar produtos em destaque
    let featuredProducts = [];
    try {
      featuredProducts = await fetchWooCommerceProducts(
        "?featured=true&per_page=12&status=publish"
      );
    } catch (error) {
      console.error("Erro ao buscar produtos em destaque:", error);
      // Fallback: usar os primeiros produtos como destaque
      featuredProducts = newProducts.slice(0, 8);
    }

    // Processar dados dos produtos para o formato esperado pelos componentes
    const processProduct = (product) => ({
      id: product.id,
      title: product.name,
      price: product.price,
      regular_price: product.regular_price,
      sale_price: product.sale_price,
      images: product.images || [],
      stock_status: product.stock_status,
      availableSizes:
        product.attributes?.find((attr) => attr.name === "Tamanho")?.options ||
        [],
      colors:
        product.attributes?.find((attr) => attr.name === "Cor")?.options || [],
      short_description: product.short_description,
      description: product.description,
    });

    const processedNewProducts = newProducts.map(processProduct);
    const processedFeaturedProducts = featuredProducts.map(processProduct);

    return {
      props: {
        newProducts: processedNewProducts,
        featuredProducts: processedFeaturedProducts,
      },
      revalidate: 300, // Revalidar a cada 5 minutos
    };
  } catch (error) {
    console.error("Erro no getStaticProps:", error);

    // Fallback: retornar arrays vazios para não quebrar o build
    return {
      props: {
        newProducts: [],
        featuredProducts: [],
      },
      revalidate: 60,
    };
  }
}
