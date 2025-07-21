// pages/account.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Cart from "../components/Cart";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export default function AccountPage() {
  const router = useRouter();
  // 'loadingAuth' é o loading do AuthContext, 'loading' é o loading do formulário local
  const {
    customer,
    isAuthenticated,
    login,
    register,
    logout,
    loading: loadingAuth,
  } = useAuth();

  const [mode, setMode] = useState("login"); // 'login' ou 'register'
  const [pageLoading, setPageLoading] = useState(true); // Estado de carregamento da página (espera AuthContext)
  const [loading, setLoading] = useState(false); // ESTADO LOCAL: loading do formulário de login/registro
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmShowPassword] = useState(false); // Corrigido: setShowConfirmPassword

  // Estados para login
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Estados para cadastro
  const [registerData, setRegisterData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Redirecionar se já estiver logado (AGORA ESPERA O CONTEXTO CARREGAR)
  useEffect(() => {
    console.log(
      "AccountPage useEffect: loadingAuth =",
      loadingAuth,
      "isAuthenticated =",
      isAuthenticated,
      "customer =",
      customer
    );
    if (!loadingAuth) {
      // Só executa se o AuthContext terminou de carregar
      if (isAuthenticated && customer) {
        console.log(
          "AccountPage: User is authenticated, redirecting to /dashboard."
        );
        router.push("/dashboard");
      } else {
        setPageLoading(false); // Define o carregamento da página como falso se não estiver autenticado
        console.log(
          "AccountPage: AuthContext finished loading, user not authenticated. Displaying form."
        );
      }
    }
  }, [isAuthenticated, customer, loadingAuth, router]); // Adicionado 'loadingAuth' às dependências

  // Exibe um estado de carregamento enquanto o AuthContext está carregando
  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Loading do formulário
    setError("");

    try {
      const result = await login(loginData.email, loginData.password);
      console.log("AccountPage: Login result from AuthContext:", result);

      if (!result.success) {
        // Se o login não foi bem-sucedido, exibe o erro
        setError(result.error || "Erro ao fazer login");
      }
      // O redirecionamento será tratado pelo useEffect acima,
      // que reage às mudanças de 'isAuthenticated' e 'customer'.
    } catch (err) {
      setError(err.message || "Erro inesperado ao fazer login");
      console.error("AccountPage: Erro capturado em handleLogin:", err);
    } finally {
      setLoading(false); // Fim do loading do formulário
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Loading do formulário
    setError("");

    // Validações
    if (registerData.password !== registerData.confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const result = await register({
        first_name: registerData.first_name,
        last_name: registerData.last_name,
        email: registerData.email,
        password: registerData.password,
      });
      console.log("AccountPage: Register result from AuthContext:", result);

      if (result.success) {
        router.push("/dashboard"); // Redireciona após o registro bem-sucedido
      } else {
        setError(result.error || "Erro ao criar conta");
      }
    } catch (err) {
      setError(err.message || "Erro inesperado ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "login") {
      setLoginData((prev) => ({ ...prev, [name]: value }));
    } else {
      setRegisterData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <>
      <Head>
        <title>Minha Conta • Nem Store</title>
      </Head>
      <Header />

      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header da página */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Minha Conta
              </h1>
              <p className="text-gray-600">
                Entre na sua conta ou crie uma nova
              </p>
            </div>

            {/* Seletor de modo */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setMode("login")}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    mode === "login"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}>
                  Já tenho conta
                </button>
                <button
                  onClick={() => setMode("register")}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    mode === "register"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}>
                  Criar conta
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Formulário */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {mode === "login" ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Entrar na Conta
                    </h2>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        E-mail *
                      </label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={loginData.email}
                          onChange={(e) => handleInputChange(e, "login")}
                          required
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="seu@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Senha *
                      </label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={loginData.password}
                          onChange={(e) => handleInputChange(e, "login")}
                          required
                          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Sua senha"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Link
                        href="/forgot-password"
                        className="text-sm text-blue-600 hover:text-blue-800">
                        Esqueci minha senha
                      </Link>
                    </div>

                    <button
                      type="submit"
                      disabled={loading} // Usa o loading LOCAL
                      className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold">
                      {loading ? "Entrando..." : "Entrar"}{" "}
                      {/* Usa o loading LOCAL */}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Criar Nova Conta
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome *
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            name="first_name"
                            value={registerData.first_name}
                            onChange={(e) => handleInputChange(e, "register")}
                            required
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Seu nome"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sobrenome *
                        </label>
                        <input
                          type="text"
                          name="last_name"
                          value={registerData.last_name}
                          onChange={(e) => handleInputChange(e, "register")}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Seu sobrenome"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        E-mail *
                      </label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={registerData.email}
                          onChange={(e) => handleInputChange(e, "register")}
                          required
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="seu@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Senha *
                      </label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={registerData.password}
                          onChange={(e) => handleInputChange(e, "register")}
                          required
                          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Mínimo 6 caracteres"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmar Senha *
                      </label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={registerData.confirmPassword}
                          onChange={(e) => handleInputChange(e, "register")}
                          required
                          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Confirme sua senha"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading} // Usa o loading LOCAL
                      className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold">
                      {loading ? "Criando conta..." : "Criar Conta"}{" "}
                      {/* Usa o loading LOCAL */}
                    </button>
                  </form>
                )}
              </div>

              {/* Informações laterais */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Vantagens de ter uma conta
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Acompanhe seus pedidos em tempo real
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Salve seus endereços para compras mais rápidas
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Acesse seu histórico de compras
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Receba ofertas exclusivas por e-mail
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Gerencie suas informações pessoais
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Precisa de ajuda?
                  </h3>
                  <p className="text-blue-700 text-sm mb-4">
                    Nossa equipe está pronta para ajudar você com qualquer
                    dúvida.
                  </p>
                  <Link
                    href="/contato"
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                    Entre em contato →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <Cart />
    </>
  );
}
