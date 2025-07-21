// pages/equipe.js
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import { FiInstagram, FiLinkedin, FiMail } from "react-icons/fi";

export default function EquipePage() {
  const teamMembers = [
    {
      id: 1,
      name: "Ana Silva",
      position: "Fundadora & CEO",
      bio: "Apaixonada por moda e empreendedorismo, Ana criou a Nem Store com o sonho de democratizar a moda feminina de qualidade.",
      image: "/images/team/ana-silva.jpg",
      social: {
        instagram: "https://instagram.com/anasilva",
        linkedin: "https://linkedin.com/in/anasilva",
        email: "ana@nem.com.br",
      },
    },
    {
      id: 2,
      name: "Mariana Costa",
      position: "Diretora de Design",
      bio: "Com mais de 10 anos de experiência em design de moda, Mariana é responsável por criar as coleções exclusivas da Nem.",
      image: "/images/team/mariana-costa.jpg",
      social: {
        instagram: "https://instagram.com/marianacosta",
        linkedin: "https://linkedin.com/in/marianacosta",
        email: "mariana@nem.com.br",
      },
    },
    {
      id: 3,
      name: "Julia Santos",
      position: "Gerente de Marketing",
      bio: "Especialista em marketing digital e branding, Julia cuida de toda a comunicação e estratégia da marca.",
      image: "/images/team/julia-santos.jpg",
      social: {
        instagram: "https://instagram.com/juliasantos",
        linkedin: "https://linkedin.com/in/juliasantos",
        email: "julia@nem.com.br",
      },
    },
    {
      id: 4,
      name: "Carla Oliveira",
      position: "Coordenadora de Vendas",
      bio: "Com experiência em varejo de moda, Carla garante que cada cliente tenha a melhor experiência de compra.",
      image: "/images/team/carla-oliveira.jpg",
      social: {
        instagram: "https://instagram.com/carlaoliveira",
        linkedin: "https://linkedin.com/in/carlaoliveira",
        email: "carla@nem.com.br",
      },
    },
    {
      id: 5,
      name: "Beatriz Lima",
      position: "Estilista",
      bio: "Formada em Design de Moda, Beatriz traz criatividade e inovação para cada peça desenvolvida pela equipe.",
      image: "/images/team/beatriz-lima.jpg",
      social: {
        instagram: "https://instagram.com/beatrizlima",
        linkedin: "https://linkedin.com/in/beatrizlima",
        email: "beatriz@nem.com.br",
      },
    },
    {
      id: 6,
      name: "Fernanda Rocha",
      position: "Atendimento ao Cliente",
      bio: "Dedicada a proporcionar o melhor atendimento, Fernanda está sempre pronta para ajudar nossas clientes.",
      image: "/images/team/fernanda-rocha.jpg",
      social: {
        instagram: "https://instagram.com/fernandarocha",
        linkedin: "https://linkedin.com/in/fernandarocha",
        email: "fernanda@nem.com.br",
      },
    },
  ];

  return (
    <>
      <Head>
        <title>Nossa Equipe - Nem Store</title>
        <meta
          name="description"
          content="Conheça a equipe apaixonada por moda que está por trás da Nem Store. Pessoas dedicadas a criar a melhor experiência para você."
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-bl from-purple-100 to-[#DCC5B2] py-16">
          <div className="max-w-3xl mx-auto px-10 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-7xl font-dancing-script font-bold text-indigo-950 mb-4 py-10">
              Nossa Equipe
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conheça as pessoas apaixonadas por moda que trabalham todos os
              dias para criar a melhor experiência para você. Uma equipe
              dedicada, criativa e comprometida com a excelência.
            </p>
          </div>
        </section>

        {/* Team Values */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Nossos Valores
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Os princípios que guiam nossa equipe e definem quem somos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💝</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Paixão
                </h3>
                <p className="text-gray-600">
                  Amamos o que fazemos e isso se reflete em cada peça, cada
                  atendimento e cada detalhe.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Colaboração
                </h3>
                <p className="text-gray-600">
                  Trabalhamos juntas, compartilhando ideias e experiências para
                  criar algo único.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Excelência
                </h3>
                <p className="text-gray-600">
                  Buscamos sempre a perfeição em tudo que fazemos, desde o
                  design até o atendimento.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Members */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Conheça Nossa Equipe
              </h2>
              <p className="text-gray-600">
                As pessoas talentosas que fazem a NEM Store acontecer
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-w-3 aspect-h-4">
                    <div className="w-full h-80 bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                      <span className="text-6xl text-gray-400">👤</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-pink-600 font-medium mb-3">
                      {member.position}
                    </p>
                    <p className="text-gray-600 text-sm mb-4">{member.bio}</p>

                    <div className="flex space-x-3">
                      <a
                        href={member.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-pink-600 transition-colors">
                        <FiInstagram className="w-5 h-5" />
                      </a>
                      <a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-pink-600 transition-colors">
                        <FiLinkedin className="w-5 h-5" />
                      </a>
                      <a
                        href={`mailto:${member.social.email}`}
                        className="text-gray-400 hover:text-pink-600 transition-colors">
                        <FiMail className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Join Team CTA */}
        <section className="py-16 bg-gradient-to-r from-pink-600 to-purple-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Quer Fazer Parte da Nossa Equipe?
            </h2>
            <p className="text-pink-100 text-lg mb-8 max-w-2xl mx-auto">
              Estamos sempre em busca de pessoas talentosas e apaixonadas por
              moda. Se você se identifica com nossos valores, adoraríamos
              conhecer você!
            </p>
            <a
              href="/contato"
              className="inline-block bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Entre em Contato
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
