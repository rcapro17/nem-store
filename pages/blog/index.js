// pages/blog/index.js
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { FiCalendar, FiUser, FiArrowRight, FiSearch } from "react-icons/fi";

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");

  const categories = [
    { id: "todos", name: "Todos os Posts" },
    { id: "dicas", name: "Dicas de Moda" },
    { id: "novidades", name: "Novidades" },
    { id: "entrevistas", name: "Entrevistas" },
    { id: "tendencias", name: "Tendências" },
  ];

  const blogPosts = [
    {
      id: 1,
      title: "Como Combinar Cores: Guia Completo para Looks Harmoniosos",
      excerpt:
        "Descubra as melhores técnicas para combinar cores e criar looks incríveis que destacam sua personalidade.",
      category: "dicas",
      author: "Mariana Costa",
      date: "2024-01-15",
      image: "/images/blog/post-1.jpg",
      slug: "como-combinar-cores-guia-completo",
    },
    {
      id: 2,
      title: "Tendências Primavera-Verão 2024: O Que Está em Alta",
      excerpt:
        "Confira as principais tendências da estação e como incorporá-las no seu guarda-roupa de forma elegante.",
      category: "tendencias",
      author: "Julia Santos",
      date: "2024-01-12",
      image: "/images/blog/post-2.jpg",
      slug: "tendencias-primavera-verao-2024",
    },
    {
      id: 3,
      title: "Entrevista: Ana Silva Conta os Segredos do Sucesso da Nem Store",
      excerpt:
        "Nossa fundadora compartilha sua jornada empreendedora e os desafios de criar uma marca de moda no Brasil.",
      category: "entrevistas",
      author: "Redação Nem",
      date: "2024-01-10",
      image: "/images/blog/post-3.jpg",
      slug: "entrevista-ana-silva-segredos-sucesso",
    },
    {
      id: 4,
      title:
        "Nova Coleção Saint-Tropez: Elegância Francesa no Seu Guarda-Roupa",
      excerpt:
        "Conheça nossa mais nova coleção inspirada na elegância e sofisticação da Riviera Francesa.",
      category: "novidades",
      author: "Beatriz Lima",
      date: "2024-01-08",
      image: "/images/blog/post-4.jpg",
      slug: "nova-colecao-saint-tropez",
    },
    {
      id: 5,
      title: "5 Peças Essenciais para um Guarda-Roupa Versátil",
      excerpt:
        "Descubra quais são as peças-chave que não podem faltar no seu armário para criar looks para qualquer ocasião.",
      category: "dicas",
      author: "Carla Oliveira",
      date: "2024-01-05",
      image: "/images/blog/post-5.jpg",
      slug: "5-pecas-essenciais-guarda-roupa-versatil",
    },
    {
      id: 6,
      title: "Sustentabilidade na Moda: Nosso Compromisso com o Futuro",
      excerpt:
        "Saiba mais sobre nossas práticas sustentáveis e como você pode fazer escolhas mais conscientes na moda.",
      category: "novidades",
      author: "Ana Silva",
      date: "2024-01-03",
      image: "/images/blog/post-6.jpg",
      slug: "sustentabilidade-na-moda-compromisso-futuro",
    },
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "todos" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
        <title>Blog - Nem Store</title>
        <meta
          name="description"
          content="Fique por dentro das últimas tendências de moda, dicas de estilo e novidades da Nem Store. Conteúdo exclusivo para mulheres que amam moda."
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-bl from-purple-100 to-[#DCC5B2] py-16">
          <div className="max-w-3xl mx-auto px-10 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-7xl font-dancing-script font-bold text-indigo-950 mb-4 py-10">
              Blog Nem Store
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dicas de moda, tendências, novidades e muito mais. Conteúdo
              exclusivo para mulheres que amam se vestir bem.
            </p>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? "bg-pink-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Post em Destaque
                </h2>
              </div>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <div className="h-64 md:h-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                      <span className="text-4xl text-gray-400">📸</span>
                    </div>
                  </div>
                  <div className="md:w-1/2 p-8">
                    <div className="flex items-center mb-4">
                      <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
                        {
                          categories.find(
                            (cat) => cat.id === filteredPosts[0].category
                          )?.name
                        }
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {filteredPosts[0].title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {filteredPosts[0].excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <FiUser className="mr-1" />
                        <span className="mr-4">{filteredPosts[0].author}</span>
                        <FiCalendar className="mr-1" />
                        <span>{formatDate(filteredPosts[0].date)}</span>
                      </div>
                      <Link
                        href={`/blog/${filteredPosts[0].slug}`}
                        className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium">
                        Ler mais
                        <FiArrowRight className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Blog Posts Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory === "todos"
                  ? "Todos os Posts"
                  : categories.find((cat) => cat.id === selectedCategory)?.name}
              </h2>
              <p className="text-gray-600 mt-2">
                {filteredPosts.length}{" "}
                {filteredPosts.length === 1
                  ? "post encontrado"
                  : "posts encontrados"}
              </p>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Nenhum post encontrado com os filtros selecionados.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.slice(1).map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="h-48 bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                      <span className="text-3xl text-gray-400">📸</span>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs font-medium">
                          {
                            categories.find((cat) => cat.id === post.category)
                              ?.name
                          }
                        </span>
                      </div>

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
                      </div>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium text-sm">
                        Ler mais
                        <FiArrowRight className="ml-1" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-gradient-to-r from-pink-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Não Perca Nenhuma Novidade!
            </h2>
            <p className="text-pink-100 text-lg mb-8">
              Assine nossa newsletter e receba em primeira mão nossas dicas de
              moda, tendências e promoções exclusivas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu melhor email"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-pink-300"
              />
              <button className="bg-white text-pink-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Assinar
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
