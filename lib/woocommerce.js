import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const consumerKey = process.env.WC_CONSUMER_KEY;
const consumerSecret = process.env.WC_CONSUMER_SECRET;
const storeUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;

if (!consumerKey || !consumerSecret || !storeUrl) {
  console.error(
    "ERRO CRÍTICO: As credenciais da API do WooCommerce não foram encontradas nas variáveis de ambiente."
  );
  throw new Error(
    "As credenciais do WooCommerce não estão configuradas corretamente."
  );
}

const woocommerce = new WooCommerceRestApi({
  url: storeUrl,
  consumerKey,
  consumerSecret,
  version: "wc/v3",
  queryStringAuth: true,
});

export default woocommerce;
