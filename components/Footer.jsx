import { useState } from "react";
import Link from "next/link";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiYoutube,
  FiSend,
} from "react-icons/fi";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);

    // Simular envio da newsletter
    setTimeout(() => {
      setIsSubscribing(false);
      setSubscribed(true);
      setEmail("");

      // Reset success message after 3 seconds
      setTimeout(() => setSubscribed(false), 3000);
    }, 1500);
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand and Contact Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-amber-100 mb-2">
                Nem Store
              </h3>
              <p className="text-gray-300 text-sm">
                Moda feminina com estilo, qualidade e preços justos. Criada por
                mulheres, para mulheres.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-300">
                <FiMapPin className="mr-3 text-amber-100 flex-shrink-0" />
                <span>
                  R. Dr. Alceu de Campos Rodrigues, 426
                  <br />
                  Itaim Bibi - São Paulo/SP
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <FiPhone className="mr-3 text-amber-100  flex-shrink-0" />
                <span>(11) 3841-4499</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <FiMail className="mr-3 text-amber-100  flex-shrink-0" />
                <span>contato@nem.com.br</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Siga-nos</h4>
              <div className="flex space-x-3">
                <a
                  href="https://instagram.com/nem_oficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-2 rounded-full hover:bg-amber-100  hover:text-blue-950 transition-colors">
                  <FiInstagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-2 rounded-full hover:bg-amber-100  hover:text-blue-950  transition-colors">
                  <FiFacebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-2 rounded-full hover:bg-amber-100  hover:text-blue-950  transition-colors">
                  <FiTwitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-2 rounded-full hover:bg-amber-100  hover:text-blue-950  transition-colors">
                  <FiYoutube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Institutional Links */}
          <div>
            <h4 className="font-semibold mb-4 text-amber-100 ">
              Institucional
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/nossa-historia"
                  className="text-gray-300 hover:text-white transition-colors">
                  Nossa História
                </Link>
              </li>
              <li>
                <Link
                  href="/equipe"
                  className="text-gray-300 hover:text-white transition-colors">
                  Nossa Equipe
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="text-gray-300 hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Help and Policies */}
          <div>
            <h4 className="font-semibold mb-4 text-amber-100 ">
              Ajuda & Políticas
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/trocas-devolucoes"
                  className="text-gray-300 hover:text-white transition-colors">
                  Trocas & Devoluções
                </Link>
              </li>
              <li>
                <Link
                  href="/formas-entrega"
                  className="text-gray-300 hover:text-white transition-colors">
                  Formas de Entrega
                </Link>
              </li>
              <li>
                <Link
                  href="/politica-privacidade"
                  className="text-gray-300 hover:text-white transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link
                  href="/termos-uso"
                  className="text-gray-300 hover:text-blue-950 transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-300 hover:text-white transition-colors">
                  Perguntas Frequentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4 text-amber-100 ">Newsletter</h4>
            <p className="text-gray-300 text-sm mb-4">
              Receba novidades, promoções exclusivas e dicas de moda direto no
              seu email.
            </p>

            {subscribed ? (
              <div className="bg-green-600 text-white p-3 rounded-lg text-sm">
                ✓ Email cadastrado com sucesso!
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu melhor email"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-100  focus:border-transparent text-white placeholder-gray-400"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="w-full bg-amber-100  text-indigo-950 font-bold py-2 px-4 rounded-lg hover:bg-amber-100  focus:ring-2 focus:ring-amber-100 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
                  {isSubscribing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <FiSend className="mr-2" />
                      Assinar
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Google Maps Section */}
      <div className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h4 className="text-xl font-semibold text-amber-100 mb-2">
              Visite Nossa Loja
            </h4>
            <p className="text-gray-300">
              R. Dr. Alceu de Campos Rodrigues, 426 - Itaim Bibi, São Paulo/SP
            </p>
          </div>

          <div className="bg-gray-700 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.7234567890123!2d-46.6784567890123!3d-23.5678901234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDM0JzA0LjQiUyA0NsKwNDAnNDIuNCJX!5e0!3m2!1spt-BR!2sbr!4v1234567890123!5m2!1spt-BR!2sbr"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização da Nem Store"></iframe>
          </div>

          <div className="mt-4 text-center">
            <a
              href="https://maps.google.com/?q=R.+Dr.+Alceu+de+Campos+Rodrigues,+426+-+Itaim+Bibi,+São+Paulo+-+SP"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-amber-100  hover:text-amber-100  transition-colors">
              <FiMapPin className="mr-2" />
              Ver no Google Maps
            </a>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-gray-800 border-t border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h4 className="font-semibold mb-4 text-amber-100 ">
              Formas de Pagamento
            </h4>
            <div className="flex flex-wrap justify-center items-center gap-4">
              <div className="bg-white rounded p-2">
                <span className="text-xs text-gray-800 font-semibold">
                  VISA
                </span>
              </div>
              <div className="bg-white rounded p-2">
                <span className="text-xs text-gray-800 font-semibold">
                  MASTER
                </span>
              </div>
              <div className="bg-white rounded p-2">
                <span className="text-xs text-gray-800 font-semibold">ELO</span>
              </div>
              <div className="bg-white rounded p-2">
                <span className="text-xs text-gray-800 font-semibold">
                  AMEX
                </span>
              </div>
              <div className="bg-white rounded p-2">
                <span className="text-xs text-gray-800 font-semibold">PIX</span>
              </div>
              <div className="bg-white rounded p-2">
                <span className="text-xs text-gray-800 font-semibold">
                  BOLETO
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div>© 2025 Nem Store. Todos os direitos reservados.</div>
            <div className="mt-2 md:mt-0">
              <span>CNPJ: 00.000.000/0001-00</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
