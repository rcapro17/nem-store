import Head from "next/head";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import SingleProductView from "../../components/SingleProductView";
import RelatedProducts from "../../components/RelatedProducts";
import woocommerce from "../../lib/woocommerce";

export default function ProductPage({ product, relatedProducts }) {
  if (!product) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-8 py-32 text-center">
          <h1 className="text-2xl font-bebas-neue text-gray-900 mb-4">
            Produto Não Encontrado
          </h1>
          <p className="text-gray-600 mb-6 font-poppins">
            O produto que você está procurando não existe ou foi removido.
          </p>
          <Link
            href="/products"
            className="inline-block bg-indigo-900 text-white px-6 py-3 rounded-md hover:bg-indigo-800 transition-colors font-bebas-neue tracking-wide">
            VOLTAR PARA A LOJA
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{product.name} • NEM Store</title>
        <meta
          name="description"
          content={product.short_description || product.name}
        />
        <meta
          name="keywords"
          content={`${product.name}, moda feminina, NEM Store`}
        />
      </Head>

      <Header />
      <PageHero
        customTitle={product.name}
        customDescription="Conheça todos os detalhes deste produto exclusivo."
      />

      <div className="bg-gray-50 min-h-screen">
        <SingleProductView product={product} />

        {/* AQUI ESTÁ A CORREÇÃO: Passa a prop 'products' para o componente RelatedProducts */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bebas-neue text-center mb-12">
                VOCÊ TAMBÉM PODE GOSTAR
              </h2>
              <RelatedProducts products={relatedProducts} />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export async function getStaticPaths() {
  try {
    const response = await woocommerce.get("products", {
      per_page: 100,
      status: "publish",
    });
    const paths = response.data.map((product) => ({
      params: { id: product.id.toString() },
    }));
    return { paths, fallback: "blocking" };
  } catch (error) {
    console.error(
      "Erro em getStaticPaths:",
      error.response?.data || error.message
    );
    return { paths: [], fallback: "blocking" };
  }
}

export async function getStaticProps({ params }) {
  const { id } = params;

  try {
    const productResponse = await woocommerce.get(`products/${id}`);
    const productData = productResponse.data;

    if (!productData || Object.keys(productData).length === 0) {
      return { notFound: true };
    }

    let relatedProductsData = [];
    if (productData.related_ids && productData.related_ids.length > 0) {
      const relatedIdsString = productData.related_ids.join(",");
      const relatedResponse = await woocommerce.get("products", {
        include: relatedIdsString,
      });
      relatedProductsData = relatedResponse.data;
    }

    // --- INÍCIO DA CORREÇÃO ---
    // Função de formatação centralizada para criar um objeto de dados limpo e seguro para serialização.
    const formatProductForProps = (p) => {
      if (!p) return null;

      const getAttributeOptions = (attrName) =>
        p.attributes?.find(
          (attr) => attr.name.toLowerCase() === attrName.toLowerCase()
        )?.options || [];

      return {
        id: p.id,
        name: p.name,
        price: p.price || 0,
        regular_price: p.regular_price || 0,
        on_sale: p.on_sale || false,
        images:
          p.images?.map((img) => ({ src: img.src, alt: img.alt || p.name })) ||
          [],
        short_description: p.short_description || "",
        // Passa os atributos já formatados para o componente de cliente não precisar ter essa lógica.
        availableSizes: getAttributeOptions("tamanho"),
        colors: getAttributeOptions("cor"),
      };
    };
    // --- FIM DA CORREÇÃO ---

    return {
      props: {
        product: formatProductForProps(productData),
        // Mapeia os produtos relacionados usando a mesma função de formatação
        relatedProducts: relatedProductsData.map(formatProductForProps),
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error(
      `Erro em getStaticProps para o produto ${id}:`,
      error.response?.data || error.message
    );
    return { notFound: true };
  }
}
