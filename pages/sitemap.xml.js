import woocommerce from "../lib/woocommerce";

function generateSiteMap(products, categories) {
  const baseUrl = "https://nem.com.br";

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Static pages -->
     <url>
       <loc>${baseUrl}</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>${baseUrl}/products</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>0.9</priority>
     </url>
     <url>
       <loc>${baseUrl}/about</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.7</priority>
     </url>
     <url>
       <loc>${baseUrl}/contact</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.7</priority>
     </url>
     
     <!-- Product categories -->
     ${categories
       .map((category) => {
         return `
       <url>
           <loc>${baseUrl}/products?category=${encodeURIComponent(
           category.slug
         )}</loc>
           <lastmod>${new Date().toISOString()}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.8</priority>
       </url>
     `;
       })
       .join("")}
     
     <!-- Products -->
     ${products
       .map((product) => {
         return `
       <url>
           <loc>${baseUrl}/products/${product.slug}</loc>
           <lastmod>${
             product.date_modified || new Date().toISOString()
           }</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.8</priority>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

export async function getServerSideProps({ res }) {
  try {
    const [productsResponse, categoriesResponse] = await Promise.all([
      woocommerce.get("products", {
        per_page: 100,
        status: "publish",
        orderby: "date",
        order: "desc",
      }),
      woocommerce.get("products/categories", {
        per_page: 100,
        hide_empty: true,
      }),
    ]);

    const products = productsResponse.data.map((product) => ({
      slug: product.slug,
      date_modified: product.date_modified,
    }));

    const categories = categoriesResponse.data.map((category) => ({
      slug: category.slug,
    }));

    const sitemap = generateSiteMap(products, categories);

    res.setHeader("Content-Type", "text/xml");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate"
    );
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error("Error generating sitemap:", error);

    const basicSitemap = generateSiteMap([], []);
    res.setHeader("Content-Type", "text/xml");
    res.write(basicSitemap);
    res.end();

    return {
      props: {},
    };
  }
}

// Exporta componente React que retorna null para satisfazer o Next.js
export default function SiteMap() {
  return null;
}
