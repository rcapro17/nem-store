import Head from "next/head";
import ScrollRevealSection from "../components/ScrollRevealSection";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function About() {
  // Or MyAccountPage, the name here doesn't affect the route
  return (
    <>
      <Header />
      <Head>
        <title>Minha Conta • Nem</title>
      </Head>
      <main className="min-h-screen flex flex-col items-center justify-center py-16 px-4">
        <ScrollRevealSection
          imageSrc="/images/nem_3257.jpg"
          altText="Modelo vestindo roupa linda"
          title="Acreditamos na Beleza Plural">
          <p>
            Acreditamos que a beleza não tem um único padrão – ela é plural,
            autêntica e pessoal.
          </p>
          <p>
            Para nós, ser Linda de Morrer vai além da estética: é um estado de
            espírito. É sobre olhar no espelho e enxergar sua própria beleza,
            exatamente como ela é – real, única e poderosa.
          </p>
        </ScrollRevealSection>
        <ScrollRevealSection
          imageSrc="/images/nem_3257.jpg"
          altText="Modelo vestindo roupa linda"
          title="Acreditamos na Beleza Plural">
          <p>
            Acreditamos que a beleza não tem um único padrão – ela é plural,
            autêntica e pessoal.
          </p>
          <p>
            Para nós, ser Linda de Morrer vai além da estética: é um estado de
            espírito. É sobre olhar no espelho e enxergar sua própria beleza,
            exatamente como ela é – real, única e poderosa.
          </p>
        </ScrollRevealSection>
      </main>
      <Footer />
    </>
  );
}
