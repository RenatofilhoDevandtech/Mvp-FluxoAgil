import React, { useState } from 'react';
// Importando ícones do Font Awesome para um visual consistente
import { FaUser, FaLock, FaSignInAlt, FaEye, FaEyeSlash, FaSyncAlt } from 'react-icons/fa';

/**
 * LoginPage Component
 * Uma página de login moderna e responsiva para o Gestor Integrado Inteligente (GII).
 * Inclui campos de usuário/email e senha, opções de "Lembrar-me" e "Esqueceu a senha",
 * e um botão de login. O design foca na clareza e usabilidade.
 *
 * @param {Object} props - As propriedades do componente.
 * @param {function} props.onLoginSuccess - Callback a ser chamado após um login bem-sucedido.
 * Em uma aplicação real, passaria as credenciais para um serviço de autenticação.
 * @param {boolean} [props.isLoading=false] - Indica se a autenticação está em andamento (para desabilitar o formulário).
 */
export const LoginPage = ({ onLoginSuccess, isLoading = false }) => {
    // Estados para os campos do formulário
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // Estado para alternar visibilidade da senha
    const [loginError, setLoginError] = useState(''); // Estado para mensagens de erro de login

    /**
     * Manipula o envio do formulário de login.
     * @param {Event} e - O evento de envio.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError(''); // Limpa erros anteriores

        // Em uma aplicação real, aqui você chamaria sua API de autenticação.
        // Por exemplo: await authService.login(email, password);
        console.log('Tentativa de login:', { email, password, rememberMe });

        if (email === 'admin@mdias.com' && password === 'admin123') { // Credenciais mockadas para demonstração
            onLoginSuccess();
        } else {
            setLoginError('Credenciais inválidas. Por favor, tente novamente.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 to-indigo-800 p-4 font-body">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-[1.01]">
                {/* Logo da Empresa */}
                <div className="flex justify-center mb-8">
                    {/* Usando um placeholder de logo com o texto GII */}
                    <img
                        src="https://placehold.co/100x100/ffffff/1e40af?text=GII"
                        alt="Logo Gestor Integrado Inteligente"
                        className="h-24 w-24 rounded-full shadow-lg border-4 border-blue-100"
                    />
                </div>

                <h2 className="text-3xl font-headline font-bold text-center text-gray-800 mb-6">
                    Bem-vindo(a) ao GII
                </h2>
                <p className="text-center text-gray-600 mb-8">
                    Faça login para acessar sua plataforma de gestão.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Campo de Email/Usuário */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            Email ou Usuário
                        </label>
                        <div className="relative">
                            <input
                                type="email" // Usar "email" para validação de formato básico
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="seu.email@empresa.com"
                                required
                                disabled={isLoading}
                            />
                            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    {/* Campo de Senha */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                            Senha
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Sua senha secreta"
                                required
                                disabled={isLoading}
                            />
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300"
                                aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    {/* Opções de "Lembrar-me" e "Esqueceu a senha" */}
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                disabled={isLoading}
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-gray-900">
                                Lembrar-me
                            </label>
                        </div>
                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors" onClick={(e) => e.preventDefault()}>
                            Esqueceu a senha?
                        </a>
                    </div>

                    {/* Mensagem de Erro de Login */}
                    {loginError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                            <FaExclamationCircle className="text-red-500" />
                            <span className="text-sm font-medium">{loginError}</span>
                        </div>
                    )}

                    {/* Botão de Login */}
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-transparent rounded-lg shadow-md text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <FaSyncAlt className="animate-spin" /> Entrando...
                            </>
                        ) : (
                            <>
                                <FaSignInAlt /> Entrar
                            </>
                        )}
                    </button>
                </form>

                {/* Opção de Cadastro (Exemplo) */}
                <p className="mt-8 text-center text-sm text-gray-600">
                    Não tem uma conta?{' '}
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors" onClick={(e) => e.preventDefault()}>
                        Entre em contato
                    </a>
                </p>
            </div>
        </div>
    );
};
