// pages/trocas-devolucoes.js
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FiPackage, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function TrocasDevolucoesPage() {
  return (
    <>
      <Head>
        <title>Trocas e Devoluções - Nem Store</title>
        <meta name="description" content="Política de trocas e devoluções da Nem Store. Saiba como trocar ou devolver produtos com facilidade e segurança." />
      </Head>

      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-100 to-purple-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trocas e Devoluções
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sua satisfação é nossa prioridade. Conheça nossa política de trocas e devoluções 
              e saiba como proceder caso precise trocar ou devolver algum produto.
            </p>
          </div>
        </section>

        {/* Quick Info */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiClock className="text-blue-600 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">30 Dias</h3>
                <p className="text-gray-600">
                  Prazo para solicitar troca ou devolução a partir do recebimento
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiPackage className="text-green-600 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Frete Grátis</h3>
                <p className="text-gray-600">
                  Primeira troca com frete por nossa conta
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheckCircle className="text-purple-600 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Processo Simples</h3>
                <p className="text-gray-600">
                  Solicitação online rápida e acompanhamento em tempo real
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Policy Details */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              
              {/* Conditions */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Condições para Troca e Devolução
                </h2>
                
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <div className="flex items-start">
                    <FiCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Produtos Aceitos</h3>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Produtos em perfeito estado de conservação</li>
                        <li>• Etiquetas originais preservadas</li>
                        <li>• Embalagem original (quando aplicável)</li>
                        <li>• Sem sinais de uso, lavagem ou alterações</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start">
                    <FiAlertCircle className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Produtos NÃO Aceitos</h3>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Produtos íntimos (por questões de higiene)</li>
                        <li>• Produtos personalizados ou sob medida</li>
                        <li>• Produtos em promoção com desconto acima de 50%</li>
                        <li>• Produtos danificados por mau uso</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* How to Request */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Como Solicitar Troca ou Devolução
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Entre em Contato</h3>
                      <p className="text-gray-600">
                        Envie um email para <strong>trocas@nem.com.br</strong> ou entre em contato pelo 
                        WhatsApp <strong>(11) 3841-4499</strong> informando o número do pedido e o motivo da troca/devolução.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Aguarde a Autorização</h3>
                      <p className="text-gray-600">
                        Nossa equipe analisará sua solicitação e enviará as instruções para envio 
                        do produto em até 24 horas úteis.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Envie o Produto</h3>
                      <p className="text-gray-600">
                        Embale o produto com cuidado e envie pelos Correios ou transportadora 
                        indicada. Guarde o código de rastreamento.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Processamento</h3>
                      <p className="text-gray-600">
                        Após recebermos o produto, faremos a análise e processaremos sua troca 
                        ou devolução em até 5 dias úteis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeframes */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Prazos e Custos
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Trocas</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• <strong>Primeira troca:</strong> Frete por nossa conta</li>
                      <li>• <strong>Trocas subsequentes:</strong> Frete por conta do cliente</li>
                      <li>• <strong>Prazo de envio:</strong> Até 3 dias úteis após análise</li>
                      <li>• <strong>Prazo de entrega:</strong> Conforme região</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Devoluções</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• <strong>Estorno:</strong> Até 5 dias úteis após análise</li>
                      <li>• <strong>Cartão de crédito:</strong> 1-2 faturas</li>
                      <li>• <strong>PIX/Boleto:</strong> Dados bancários necessários</li>
                      <li>• <strong>Frete de retorno:</strong> Por conta do cliente</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Special Cases */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Casos Especiais
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Produto com Defeito</h3>
                    <p className="text-gray-600">
                      Se o produto apresentar defeito de fabricação, entre em contato imediatamente. 
                      Faremos a troca ou devolução com frete totalmente gratuito, independente do prazo.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Produto Errado</h3>
                    <p className="text-gray-600">
                      Caso tenha recebido um produto diferente do pedido, entre em contato conosco. 
                      Faremos a correção imediatamente com frete gratuito para troca.
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Arrependimento da Compra</h3>
                    <p className="text-gray-600">
                      Conforme o Código de Defesa do Consumidor, você tem 7 dias para desistir da compra 
                      realizada online, sem necessidade de justificativa.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-gradient-to-r from-pink-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Precisa de Ajuda?
            </h2>
            <p className="text-pink-100 text-lg mb-8">
              Nossa equipe está pronta para ajudar você com qualquer dúvida sobre trocas e devoluções.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:trocas@nem.com.br"
                className="bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Enviar Email
              </a>
              <a
                href="https://wa.me/5511384144999"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

