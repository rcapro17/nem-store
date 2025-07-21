// components/ProductGrid.jsx
import ProductGridItem from "./ProductGridItem";

export default function ProductGrid({
  products = [],
  loading = false,
  error = null,
  gridCols = 4,
  loadMore,
  canLoadMore,
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) {
  const getGridClasses = () => {
    switch (gridCols) {
      case 2:
        return "grid-cols-1 sm:grid-cols-2";
      case 3:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
      case 5:
        return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
      default:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-poppins">Carregando produtos...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bebas-neue text-gray-900 mb-2">
          Erro ao carregar produtos
        </h3>
        <p className="text-gray-600 font-poppins">{error}</p>
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bebas-neue text-gray-900 mb-2">
          Nenhum produto encontrado
        </h3>
        <p className="text-gray-600 font-poppins">
          Tente ajustar os filtros ou buscar por outros termos.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Grid de produtos */}
      <div className={`grid gap-6 ${getGridClasses()}`}>
        {products.map((product, index) => (
          <ProductGridItem
            key={`${product.id}-${index}`}
            product={product}
            index={index}
          />
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-12">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 font-poppins">
            Anterior
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-4 py-2 border rounded-md font-poppins ${
                  currentPage === page
                    ? "bg-sky-950 text-white border-sky-950"
                    : "border-gray-300 hover:bg-gray-200"
                }`}>
                {page}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 font-poppins">
            Próxima
          </button>
        </div>
      )}

      {/* Load More Button (alternativo à paginação) */}
      {canLoadMore && (
        <div className="text-center mt-12">
          <button
            onClick={loadMore}
            className="bg-white border-2 border-gray-900 text-gray-900 px-8 py-3 font-bebas-neue text-lg tracking-wide hover:bg-gray-900 hover:text-white transition-all duration-300 transform hover:scale-105">
            CARREGAR MAIS PRODUTOS
          </button>
        </div>
      )}

      {/* Mensagem final */}
      {!canLoadMore && !totalPages && products.length > 0 && (
        <div className="text-center mt-12 py-8 border-t border-gray-200">
          <p className="text-gray-600 font-poppins">
            Você visualizou todos os {products.length} produtos disponíveis
          </p>
        </div>
      )}
    </div>
  );
}
