// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Bebas+Neue&family=Poppins:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        
        {/* Meta tags */}
        <meta name="description" content="NEM Store - Moda feminina exclusiva e cheia de estilo" />
        <meta name="keywords" content="moda feminina, roupas, vestidos, blusas, acessórios" />
        <meta name="author" content="NEM Store" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#6366f1" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="NEM Store - Moda Feminina" />
        <meta property="og:description" content="Moda feminina exclusiva e cheia de estilo" />
        <meta property="og:image" content="/images/nem_logo.png" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NEM Store - Moda Feminina" />
        <meta name="twitter:description" content="Moda feminina exclusiva e cheia de estilo" />
        <meta name="twitter:image" content="/images/nem_logo.png" />
      </Head>
      <body className="font-poppins">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

