// pages/nossa-historia.js
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function NossaHistoriaPage() {
  const timeline = [
    {
      year: "2018",
      title: "O Sonho Começou",
      description:
        "Ana Silva, apaixonada por moda desde pequena, decidiu transformar seu sonho em realidade. Com uma pequena economia e muito amor pela moda feminina, nasceu a ideia da Nem Store.",
    },
    {
      year: "2019",
      title: "Primeira Coleção",
      description:
        "Lançamos nossa primeira coleção com apenas 15 peças, todas pensadas para mulheres que buscam elegância e conforto no dia a dia. O sucesso foi imediato!",
    },
    {
      year: "2020",
      title: "Expansão Digital",
      description:
        "Com a pandemia, investimos pesado no e-commerce. Nossa loja online se tornou o principal canal de vendas, alcançando clientes em todo o Brasil.",
    },
    {
      year: "2021",
      title: "Primeira Loja Física",
      description:
        "Abrimos nossa primeira loja física no coração de São Paulo. Um espaço acolhedor onde nossas clientes podem experimentar e sentir a qualidade de nossas peças.",
    },
    {
      year: "2022",
      title: "Sustentabilidade",
      description:
        "Implementamos práticas sustentáveis em toda nossa cadeia produtiva. Começamos a usar tecidos orgânicos e processos eco-friendly.",
    },
    {
      year: "2023",
      title: "Reconhecimento",
      description:
        "Fomos reconhecidas como uma das marcas de moda feminina que mais cresce no Brasil. Mais de 50.000 clientes satisfeitas!",
    },
    {
      year: "2024",
      title: "Expansão Nacional",
      description:
        "Hoje estamos presentes em todas as regiões do Brasil, com uma equipe dedicada e apaixonada por criar a melhor experiência para nossas clientes.",
    },
  ];

  return (
    <>
      <Head>
        <title>Nossa História - Nem Store</title>
        <meta
          name="description"
          content="Conheça a história da Nem Store, desde o sonho inicial até nos tornarmos uma das marcas de moda feminina que mais cresce no Brasil."
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-pink-100 to-purple-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nossa História
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Uma jornada de paixão, dedicação e amor pela moda feminina.
              Descubra como a NEM Store nasceu e se tornou o que é hoje.
            </p>
          </div>
        </section>

        {/* Story Introduction */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Tudo Começou com um Sonho
              </h2>
            </div>

            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="text-xl leading-relaxed mb-6">
                Em 2018, Ana Silva olhava para seu guarda-roupa e sentia que
                algo estava faltando. Peças que combinassem elegância, conforto
                e um preço justo pareciam impossíveis de encontrar. Foi então
                que ela decidiu: "Se não existe, eu vou criar."
              </p>

              <p className="text-lg leading-relaxed mb-6">
                O que começou como uma necessidade pessoal rapidamente se
                transformou em uma paixão. Ana percebeu que não estava sozinha -
                milhares de mulheres compartilhavam da mesma frustração. Queriam
                roupas que as fizessem se sentir confiantes, bonitas e
                confortáveis, sem precisar comprometer o orçamento.
              </p>

              <p className="text-lg leading-relaxed">
                Assim nasceu a Nem Store: uma marca criada por mulheres, para
                mulheres, com o propósito de democratizar a moda de qualidade e
                fazer cada cliente se sentir única e especial.
              </p>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Missão
                </h3>
                <p className="text-gray-600">
                  Democratizar a moda feminina de qualidade, oferecendo peças
                  elegantes, confortáveis e acessíveis que façam cada mulher se
                  sentir confiante e única.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">👁️</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Visão</h3>
                <p className="text-gray-600">
                  Ser a marca de moda feminina mais amada do Brasil, reconhecida
                  pela qualidade, inovação e pelo cuidado especial com cada
                  cliente.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">💎</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Valores
                </h3>
                <p className="text-gray-600">
                  Qualidade, autenticidade, sustentabilidade, inclusão e o
                  compromisso de fazer cada mulher se sentir especial e
                  valorizada.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Nossa Jornada
              </h2>
              <p className="text-gray-600">
                Os marcos mais importantes da nossa história
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-pink-200"></div>

              {timeline.map((item, index) => (
                <div key={index} className="relative flex items-start mb-12">
                  {/* Timeline dot */}
                  <div className="absolute left-6 w-4 h-4 bg-pink-600 rounded-full border-4 border-white shadow-lg"></div>

                  {/* Content */}
                  <div className="ml-16">
                    <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center mb-2">
                        <span className="bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold mr-4">
                          {item.year}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Numbers Section */}
        <section className="py-16 bg-gradient-to-r from-pink-600 to-purple-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Nem Store em Números
              </h2>
              <p className="text-pink-100">
                Alguns números que mostram nosso crescimento e impacto
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-white mb-2">50K+</div>
                <div className="text-pink-100">Clientes Satisfeitas</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-pink-100">Produtos Únicos</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">6</div>
                <div className="text-pink-100">Anos de História</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">100%</div>
                <div className="text-pink-100">Amor pela Moda</div>
              </div>
            </div>
          </div>
        </section>

        {/* Future Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              O Futuro da Nem Store
            </h2>
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="text-lg leading-relaxed mb-6">
                Nossa jornada está apenas começando. Temos grandes planos para o
                futuro: novas coleções sustentáveis, parcerias com designers
                brasileiros, expansão internacional e muito mais.
              </p>
              <p className="text-lg leading-relaxed">
                Mas uma coisa nunca mudará: nosso compromisso com você, nossa
                cliente. Continuaremos trabalhando todos os dias para criar
                peças que façam você se sentir incrível, porque acreditamos que
                toda mulher merece se sentir linda de morrer.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
