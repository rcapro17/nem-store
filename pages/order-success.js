// pages/order-success.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FiCheckCircle, FiShoppingBag, FiTruck, FiMail } from 'react-icons/fi';

export default function OrderSuccessPage() {
  const router = useRouter();
  const { order } = router.query;
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (order) {
      // Simular dados do pedido (em produção, buscar da API)
      setOrderData({
        id: order,
        number: `#NEM${order}`,
        status: 'processing',
        total: '299.90',
        payment_method: 'PayPal',
        created_at: new Date().toISOString(),
        billing: {
          first_name: 'Cliente',
          last_name: 'NEM Store',
          email: 'cliente@example.com'
        }
      });
      setLoading(false);
    }
  }, [order]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Pedido Confirmado • Nem Store</title>
      </Head>
      
      <Header />
      
      <div className="min-h-screen bg-gray-50 pt-20 font-poppins">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Ícone de sucesso */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <FiCheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bebas-neue text-gray-900 mb-2">
                PEDIDO CONFIRMADO!
              </h1>
              <p className="text-gray-600">
                Obrigado por comprar na NEM Store. Seu pedido foi processado com sucesso.
              </p>
            </div>

            {/* Detalhes do pedido */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bebas-neue mb-4">DETALHES DO PEDIDO</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Número do Pedido</p>
                  <p className="font-semibold">{orderData?.number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="font-semibold">R$ {orderData?.total}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pagamento</p>
                  <p className="font-semibold">{orderData?.payment_method}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Processando
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">E-mail de confirmação enviado para:</p>
                <p className="font-semibold">{orderData?.billing?.email}</p>
              </div>
            </div>

            {/* Próximos passos */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-bebas-neue mb-4">PRÓXIMOS PASSOS</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <FiMail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Confirmação por E-mail</h4>
                    <p className="text-sm text-gray-600">
                      Você receberá um e-mail com todos os detalhes do seu pedido em alguns minutos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <FiShoppingBag className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Preparação do Pedido</h4>
                    <p className="text-sm text-gray-600">
                      Nossa equipe começará a preparar seu pedido em até 1 dia útil.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <FiTruck className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Envio e Entrega</h4>
                    <p className="text-sm text-gray-600">
                      Você receberá o código de rastreamento assim que o pedido for enviado.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products" className="flex-1">
                <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-bebas-neue text-lg tracking-wide">
                  CONTINUAR COMPRANDO
                </button>
              </Link>
              
              <Link href="/dashboard" className="flex-1">
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-50 transition-colors font-bebas-neue text-lg tracking-wide">
                  MEUS PEDIDOS
                </button>
              </Link>
            </div>

            {/* Informações de contato */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 mb-2">
                Dúvidas sobre seu pedido?
              </p>
              <p className="text-sm">
                Entre em contato: <a href="mailto:contato@nemstore.com" className="text-blue-600 hover:text-blue-800">contato@nemstore.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}

