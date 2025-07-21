// pages/blog/dicas.js
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { FiCalendar, FiUser, FiArrowRight, FiArrowLeft } from "react-icons/fi";

export default function DicasPage() {
  const dicasPosts = [
    {
      id: 1,
      title: "Como Combinar Cores: Guia Completo para Looks Harmoniosos",
      excerpt:
        "Descubra as melhores técnicas para combinar cores e criar looks incríveis que destacam sua personalidade. Aprenda sobre círculo cromático, cores complementares e muito mais.",
      author: "Mariana Costa",
      date: "2024-01-15",
      readTime: "5 min",
      image: "/images/blog/dicas-1.jpg",
      slug: "como-combinar-cores-guia-completo",
    },
    {
      id: 2,
      title: "5 Peças Essenciais para um Guarda-Roupa Versátil",
      excerpt:
        "Descubra quais são as peças-chave que não podem faltar no seu armário para criar looks para qualquer ocasião, desde o trabalho até eventos especiais.",
      author: "Carla Oliveira",
      date: "2024-01-12",
      readTime: "4 min",
      image: "/images/blog/dicas-2.jpg",
      slug: "5-pecas-essenciais-guarda-roupa-versatil",
    },
    {
      id: 3,
      title: "Como Escolher o Tamanho Certo: Guia de Medidas",
      excerpt:
        "Aprenda a tirar suas medidas corretamente e escolher o tamanho ideal para cada tipo de peça. Dicas para compras online sem erro.",
      author: "Beatriz Lima",
      date: "2024-01-10",
      readTime: "6 min",
      image: "/images/blog/dicas-3.jpg",
      slug: "como-escolher-tamanho-certo-guia-medidas",
    },
    {
      id: 4,
      title: "Looks para o Trabalho: Elegância e Conforto",
      excerpt:
        "Ideias de looks profissionais que combinam elegância e conforto. Como se vestir bem para o trabalho sem abrir mão do seu estilo pessoal.",
      author: "Julia Santos",
      date: "2024-01-08",
      readTime: "7 min",
      image: "/images/blog/dicas-4.jpg",
      slug: "looks-trabalho-elegancia-conforto",
    },
    {
      id: 5,
      title: "Cuidados com as Roupas: Como Fazer Durar Mais",
      excerpt:
        "Dicas essenciais para cuidar das suas roupas e fazer com que durem muito mais tempo. Lavagem, secagem, passagem e armazenamento corretos.",
      author: "Fernanda Rocha",
      date: "2024-01-05",
      readTime: "5 min",
      image: "/images/blog/dicas-5.jpg",
      slug: "cuidados-roupas-como-fazer-durar-mais",
    },
    {
      id: 6,
      title: "Acessórios que Transformam: Pequenos Detalhes, Grande Impacto",
      excerpt:
        "Como usar acessórios para transformar looks básicos em produções incríveis. Bolsas, joias, lenços e sapatos que fazem a diferença.",
      author: "Mariana Costa",
      date: "2024-01-03",
      readTime: "4 min",
      image: "/images/blog/dicas-6.jpg",
      slug: "acessorios-que-transformam-pequenos-detalhes",
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Head>
        <title>Dicas de Moda - Blog Nem Store</title>
        <meta
          name="description"
          content="Dicas exclusivas de moda e estilo para você se vestir bem em qualquer ocasião. Guias práticos e conselhos de especialistas."
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-pink-100 to-purple-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-6">
              <Link
                href="/blog"
                className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium">
                <FiArrowLeft className="mr-2" />
                Voltar ao Blog
              </Link>
            </div>

            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Dicas de Moda
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Guias práticos, dicas de estilo e conselhos de especialistas
                para você se vestir bem em qualquer ocasião e expressar sua
                personalidade através da moda.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Tip */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Dica em Destaque
              </h2>
            </div>

            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg overflow-hidden shadow-lg">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div className="h-64 md:h-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                    <span className="text-4xl text-gray-400">💡</span>
                  </div>
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center mb-4">
                    <span className="bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Dica Popular
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {dicasPosts[0].title}
                  </h3>
                  <p className="text-gray-600 mb-6">{dicasPosts[0].excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiUser className="mr-1" />
                      <span className="mr-4">{dicasPosts[0].author}</span>
                      <FiCalendar className="mr-1" />
                      <span className="mr-4">
                        {formatDate(dicasPosts[0].date)}
                      </span>
                      <span>{dicasPosts[0].readTime} de leitura</span>
                    </div>
                    <Link
                      href={`/blog/${dicasPosts[0].slug}`}
                      className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium">
                      Ler dica completa
                      <FiArrowRight className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tips Categories */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="bg-pink-100 text-pink-800 px-4 py-2 rounded-full text-sm font-medium">
                Combinação de Cores
              </div>
              <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                Guarda-roupa Essencial
              </div>
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                Looks Profissionais
              </div>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                Cuidados com Roupas
              </div>
              <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
                Acessórios
              </div>
            </div>
          </div>
        </section>

        {/* Tips Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Todas as Dicas
              </h2>
              <p className="text-gray-600 mt-2">
                {dicasPosts.length} dicas para você arrasar no visual
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dicasPosts.slice(1).map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                    <span className="text-3xl text-gray-400">💡</span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center">
                        <FiUser className="mr-1" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center">
                        <FiCalendar className="mr-1" />
                        <span>{formatDate(post.date)}</span>
                      </div>
                      <span>{post.readTime}</span>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium text-sm">
                      Ler dica
                      <FiArrowRight className="ml-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Tips Section */}
        <section className="py-16 bg-gradient-to-r from-pink-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Dicas Rápidas do Dia
              </h2>
              <p className="text-pink-100">
                Pequenas dicas que fazem grande diferença no seu visual
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  💄 Dica de Hoje
                </h3>
                <p className="text-pink-100">
                  Use um batom nude para alongar visualmente o pescoço quando
                  usar golas altas ou cachecóis.
                </p>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  👗 Truque de Estilo
                </h3>
                <p className="text-pink-100">
                  Dobre as mangas da camisa por baixo do blazer para criar um
                  visual mais moderno e despojado.
                </p>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  👠 Dica de Conforto
                </h3>
                <p className="text-pink-100">
                  Use palmilhas de gel transparente para tornar qualquer sapato
                  mais confortável sem comprometer o visual.
                </p>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  ✨ Segredo de Styling
                </h3>
                <p className="text-pink-100">
                  Amarre uma camisa na cintura para criar um ponto focal e
                  valorizar a silhueta em looks casuais.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
