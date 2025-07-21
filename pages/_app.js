// pages/_app.js
"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Script from "next/script";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import Cart from "../components/Cart";
import "../styles/globals.css";

// IMPORTE ESTAS DUAS LINHAS:
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Importe a fonte Bebas Neue
import { Bebas_Neue } from "next/font/google";

// Configure a fonte Bebas Neue
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400", // Bebas Neue geralmente tem apenas um peso: Regular (400)
  variable: "--font-bebas-neue", // Nome da variável CSS para usar a fonte
  display: "swap", // Opcional: Garante que o texto seja visível enquanto a fonte carrega
});

// Google Analytics tracking
const GA_TRACKING_ID = "G-XXXXXXXXXX"; // Substitua pelo seu ID do Google Analytics

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Google Analytics
    const handleRouteChange = (url) => {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("config", GA_TRACKING_ID, {
          page_path: url,
        });
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        {/* Meta tags básicas */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="NEM Store" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="NEM Store" />
        <meta property="og:locale" content="pt_BR" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      {/* Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>

      {/* Schema.org para e-commerce */}
      <Script
        id="schema-org"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "NEM Store",
            url: "https://nem.com.br",
            logo: "https://nem.com.br/logo.png",
            description:
              "Loja de roupas femininas com as últimas tendências da moda.",
            address: {
              "@type": "PostalAddress",
              addressCountry: "BR",
            },
            sameAs: [
              "https://www.instagram.com/nemstore",
              "https://www.facebook.com/nemstore",
            ],
          }),
        }}
      />

      <AuthProvider>
        <CartProvider>
          {/* Aplica a variável CSS da fonte ao elemento principal */}
          <div className={`${bebasNeue.variable} font-sans`}>
            {" "}
            {/* Adicionado font-sans como fallback */}
            <Component {...pageProps} />
            {/* Cart global - renderizado em todas as páginas */}
            <Cart />
            {/* ADICIONE O TOASTCONTAINER AQUI: */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default MyApp;
