// pages/api/products/[id].js
import woocommerce from "../../../lib/woocommerce";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    const response = await woocommerce.get(`products/${id}`);
    const product = response.data;

    // Se a resposta do WooCommerce for vazia ou indicar que o produto não existe
    if (
      !product ||
      Object.keys(product).length === 0 ||
      product.code === "woocommerce_rest_product_invalid_id"
    ) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Mapeamento e formatação dos dados do produto
    const colorAttribute = product.attributes?.find(
      (attr) => attr.name === "Cor" || attr.name === "color"
    );
    const productColors = colorAttribute?.options?.map(String) || []; // Acesso seguro e fallback

    const sizeAttribute = product.attributes?.find(
      (attr) => attr.name === "Tamanho" || attr.name === "size"
    );
    let availableSizes = [];
    if (sizeAttribute && Array.isArray(sizeAttribute.options)) {
      const sizeMap = {
        P: "38",
        M: "40",
        G: "42",
        GG: "44",
        XL: "46",
      };
      availableSizes = sizeAttribute.options.map(
        (option) => sizeMap[option] || option.toString()
      );
    }

    // Mapeia categorias para um formato mais simples se necessário, ou apenas pega o nome
    const mappedCategories =
      product.categories?.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
      })) || [];

    const mappedProduct = {
      id: product.id,
      title: product.name, // Usar 'name' do WooCommerce como 'title' no frontend
      price: parseFloat(product.price || 0),
      regular_price: parseFloat(product.regular_price || 0),
      sale_price: product.sale_price ? parseFloat(product.sale_price) : null,
      on_sale: product.on_sale,
      images:
        product.images?.map((img) => ({
          // Acesso seguro e fallback
          id: img.id,
          src: img.src,
          alt: img.alt || product.name,
        })) || [],
      colors: productColors,
      availableSizes: availableSizes,
      categories: mappedCategories, // Passa as categorias mapeadas
      stock_quantity:
        product.stock_quantity !== null
          ? parseInt(product.stock_quantity)
          : null,
      stock_status: product.stock_status,
      permalink: product.permalink,
      short_description: product.short_description || "",
      description: product.description || "",
      related_ids: product.related_ids || [], // Garante que seja um array
      status: product.status, // Adicionado para consistência, se precisar no frontend
      // Outras propriedades úteis que podem vir do WooCommerce:
      sku: product.sku || null,
      dimensions: product.dimensions || {},
      weight: product.weight || null,
    };

    res.status(200).json(mappedProduct);
  } catch (error) {
    console.error(
      `Error fetching product ${id} from WooCommerce API route:`,
      error.response?.data || error.message,
      error.response?.status
    );

    // Se for um erro 404 (Produto não encontrado na API do WooCommerce),
    // já tratamos isso dentro do bloco try com `if (!product || ...)`
    // Este catch agora foca em erros de conexão ou servidor (5xx)

    // Fallback: retornar produto de exemplo quando há um erro de conexão
    // ou qualquer outro erro que não seja um 404 de produto inexistente.
    // Usar a imagem de fallback da pasta pública.
    const fallbackProduct = {
      id: parseInt(id),
      title: `Produto de Exemplo ${id}`,
      price: 89.9,
      regular_price: 89.9,
      sale_price: null,
      on_sale: false,
      images: [
        {
          id: 999,
          src: "/placeholder-image.png", // Imagem de placeholder
          alt: `Produto de Exemplo ${id}`,
        },
      ],
      colors: ["Preto", "Branco"],
      availableSizes: ["P", "M", "G"],
      categories: [{ id: 99, name: "Exemplo", slug: "exemplo" }],
      stock_quantity: 5,
      stock_status: "instock",
      permalink: `/products/${id}`,
      short_description: `Esta é uma descrição de fallback para o produto ${id}.`,
      description: `<p>Esta é uma descrição mais longa do produto de exemplo ${id}.</p><p>Isso acontece quando não conseguimos conectar ao WooCommerce.</p>`,
      related_ids: [1, 2, 3]
        .filter((relId) => relId !== parseInt(id))
        .slice(0, 3), // max 3 relacionados
      status: "publish",
      sku: `SKU-${id}`,
    };

    // Retorna 500 para indicar um erro no servidor ou na comunicação com o WooCommerce
    res.status(500).json(fallbackProduct);
  }
}
