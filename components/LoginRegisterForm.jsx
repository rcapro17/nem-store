// components/LoginRegisterForm.jsx
"use client";

import { useState } from "react";
import Link from "next/link"; // For "Esqueci minha senha" and "Entrar na minha conta"

export default function LoginRegisterForm() {
  // State for login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // State for register form
  const [registerName, setRegisterName] = useState("");
  const [registerSurname, setRegisterSurname] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerError, setRegisterError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");
    // Basic validation
    if (!loginEmail || !loginPassword) {
      setLoginError("Por favor, preencha todos os campos.");
      return;
    }
    // In a real application, you would send this data to your backend for authentication
    console.log("Login attempt:", {
      email: loginEmail,
      password: loginPassword,
    });
    alert("Login button clicked! (Implement actual login logic)"); // Placeholder
    // On success, redirect or update user context
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setRegisterError("");
    // Basic validation
    if (
      !registerName ||
      !registerSurname ||
      !registerEmail ||
      !registerPassword ||
      !registerConfirmPassword
    ) {
      setRegisterError("Por favor, preencha todos os campos.");
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      setRegisterError("As senhas não coincidem.");
      return;
    }
    // In a real application, you would send this data to your backend for user registration
    console.log("Register attempt:", {
      name: registerName,
      surname: registerSurname,
      email: registerEmail,
      password: registerPassword,
    });
    alert("Register button clicked! (Implement actual registration logic)"); // Placeholder
    // On success, redirect or update user context
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h2 className="text-center text-xl text-gray-700 font-light mb-8">
        Conecte-se aqui
      </h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column: Já sou cliente (Login) */}
        <div className="flex-1 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 uppercase mb-6 tracking-wide">
            Já sou cliente
          </h3>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-medium text-gray-600 uppercase mb-1">
                E-MAIL
              </label>
              <input
                type="email"
                id="login-email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-medium text-gray-600 uppercase mb-1">
                SENHA
              </label>
              <input
                type="password"
                id="login-password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
            </div>
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <Link
              href="/forgot-password"
              className="block text-sm text-gray-600 hover:underline mb-4">
              ESQUECI MINHA SENHA
            </Link>
            <button
              type="submit"
              className="w-full bg-stone-400 text-white py-3 rounded-md hover:bg-stone-500 transition-colors text-lg font-semibold">
              ENTRAR
            </button>
            <button
              type="button" // Use type="button" to prevent form submission
              onClick={() => alert("Entrar com Facebook clicked!")} // Placeholder
              className="w-full bg-blue-700 text-white py-3 rounded-md hover:bg-blue-800 transition-colors text-lg font-semibold">
              ENTRAR COM FACEBOOK
            </button>
          </form>
        </div>

        {/* Right Column: Ainda não tenho cadastro (Register) */}
        <div className="flex-1 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 uppercase mb-6 tracking-wide">
            Ainda não tenho cadastro
          </h3>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="register-name"
                  className="block text-xs font-medium text-gray-600 uppercase mb-1">
                  NOME
                </label>
                <input
                  type="text"
                  id="register-name"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="register-surname"
                  className="block text-xs font-medium text-gray-600 uppercase mb-1">
                  SOBRENOME
                </label>
                <input
                  type="text"
                  id="register-surname"
                  value={registerSurname}
                  onChange={(e) => setRegisterSurname(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="register-email"
                className="block text-xs font-medium text-gray-600 uppercase mb-1">
                E-MAIL
              </label>
              <input
                type="email"
                id="register-email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="register-password"
                className="block text-xs font-medium text-gray-600 uppercase mb-1">
                SENHA
              </label>
              <input
                type="password"
                id="register-password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="register-confirm-password"
                className="block text-xs font-medium text-gray-600 uppercase mb-1">
                CONFIRME A SENHA
              </label>
              <input
                type="password"
                id="register-confirm-password"
                value={registerConfirmPassword}
                onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
            </div>
            {registerError && (
              <p className="text-red-500 text-sm">{registerError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-stone-400 text-white py-3 rounded-md hover:bg-stone-500 transition-colors text-lg font-semibold">
              ENTRAR
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
