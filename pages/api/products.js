// pages/api/products.js
import woocommerce from "../../lib/woocommerce";

export default async function handler(req, res) {
  const {
    include,
    category, // Recebe o slug da categoria
    featured,
    orderby,
    order,
    per_page,
    page,
    search,
    min_price, // Novo: mínimo preço
    max_price, // Novo: máximo preço
    // Atributos para filtro de tamanho/cor (se WooCommerce API padrão aceitar)
    // attribute,
    // attribute_term,
  } = req.query;

  const params = {
    status: "publish",
    per_page: per_page ? parseInt(per_page) : 12,
    page: page ? parseInt(page) : 1,
  };

  if (include) params.include = include;
  if (featured === "true") params.featured = true;
  if (orderby) params.orderby = orderby;
  if (order) params.order = order;
  if (search) params.search = search;

  // Adiciona filtros de preço ao WooCommerce
  if (min_price) params.min_price = min_price;
  if (max_price) params.max_price = max_price;

  // Lógica para filtrar por categoria (convertendo slug para ID)
  // O WooCommerce API filtra por ID de categoria, não slug diretamente na chamada de produtos
  if (category) {
    try {
      const categoriesResponse = await woocommerce.get("products/categories", {
        slug: category,
        per_page: 1,
      });

      if (categoriesResponse.data && categoriesResponse.data.length > 0) {
        params.category = categoriesResponse.data[0].id; // Converte slug para ID
      } else {
        console.warn(
          `Categoria "${category}" não encontrada. Continuando sem filtro de categoria.`
        );
        // Se a categoria não for encontrada, não adicione o parâmetro de categoria
      }
    } catch (catError) {
      console.error(
        "Erro ao buscar ID da categoria para filtragem:",
        catError.response?.data || catError.message
      );
      // Continua a busca de produtos sem filtro de categoria se houver erro
    }
  }

  try {
    const response = await woocommerce.get("products", params);

    const totalProducts = response.headers["x-wp-total"] || 0;
    const totalPages = response.headers["x-wp-totalpages"] || 0;

    const products = response.data.map((product) => {
      const colorAttribute = product.attributes?.find(
        (attr) =>
          attr.name.toLowerCase() === "cor" ||
          attr.name.toLowerCase() === "color"
      );
      const productColors = colorAttribute?.options?.map(String) || [];

      const sizeAttribute = product.attributes?.find(
        (attr) =>
          attr.name.toLowerCase() === "tamanho" ||
          attr.name.toLowerCase() === "size"
      );
      let availableSizes = [];
      if (sizeAttribute && Array.isArray(sizeAttribute.options)) {
        // Mapeamento dos tamanhos para os valores numéricos se necessário
        const sizeMap = {
          P: "38",
          M: "40",
          G: "42",
          GG: "44",
          XL: "46", // Exemplo de mapeamento se seus dados WooCommerce usam letras
          // Você pode precisar adicionar mais aqui se seus termos no Woo forem diferentes dos numéricos
          // Por exemplo, se "40" estiver como termo, ele já será pego diretamente pelo map(String)
        };
        availableSizes = sizeAttribute.options.map(
          (option) => sizeMap[option] || option.toString() // Tenta mapear, senão usa o valor original
        );
      }

      return {
        id: product.id,
        title: product.name,
        price: parseFloat(product.price || 0),
        regular_price: parseFloat(product.regular_price || 0),
        sale_price: product.sale_price ? parseFloat(product.sale_price) : null,
        on_sale: product.on_sale,
        images:
          product.images?.map((img) => ({
            id: img.id,
            src: img.src,
            alt: img.alt || product.name,
          })) || [],
        colors: productColors,
        availableSizes: availableSizes, // Já formatado com os tamanhos numéricos ou originais
        categories:
          product.categories?.map((cat) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
          })) || [],
        stock_quantity:
          product.stock_quantity !== null
            ? parseInt(product.stock_quantity)
            : null,
        stock_status: product.stock_status,
        slug: product.slug,
        sku: product.sku || null,
        description: product.description || "",
        short_description: product.short_description || "",
        related_ids: product.related_ids || [],
        featured: product.featured || false,
      };
    });

    res.status(200).json({
      products: products,
      total: parseInt(totalProducts),
      total_pages: parseInt(totalPages),
    });
  } catch (error) {
    console.error(
      "Erro ao buscar produtos do WooCommerce API route:",
      error.response?.data || error.message,
      error.response?.status
    );

    res.status(500).json({
      products: [],
      total: 0,
      total_pages: 0,
      error: "Failed to fetch products from WooCommerce API.",
      details: error.response?.data || error.message,
    });
  }
}
