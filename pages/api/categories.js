// pages/api/categories.js
import woocommerce from "../../lib/woocommerce";

export default async function handler(req, res) {
  try {
    const response = await woocommerce.get("products/categories", {
      per_page: 100, // Ajuste conforme o número máximo de categorias que você espera
      hide_empty: true, // Não retorna categorias sem produtos
      orderby: "name",
      order: "asc",
    });

    const categories = response.data.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      count: cat.count,
    }));

    res.status(200).json({ categories });
  } catch (error) {
    console.error(
      "Erro ao buscar categorias do WooCommerce API route:",
      error.response?.data || error.message,
      error.response?.status
    );
    res.status(500).json({
      categories: [],
      error: "Failed to fetch categories from WooCommerce API.",
    });
  }
}
