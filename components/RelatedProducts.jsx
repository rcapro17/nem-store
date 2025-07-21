// components/RelatedProducts.jsx
import ProductGridItem from "./ProductGridItem";

// CORREÇÃO: O componente agora é simples e não usa 'useState' ou 'useEffect'.
// Ele recebe a prop 'products', que é um array de objetos de produto completos.
export default function RelatedProducts({ products }) {
  // Se não houver produtos ou a lista estiver vazia, não renderiza nada.
  if (!products || products.length === 0) {
    return null;
  }

  return (
    // A seção e o título foram movidos para a página principal (ProductPage)
    // para manter este componente focado apenas no grid.
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <ProductGridItem key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
