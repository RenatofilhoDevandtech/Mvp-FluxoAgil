import React, { useState } from 'react';
import { LuMenu } from 'react-icons/lu'; // Importando ícone de menu do Lucide React via React Icons
import { FaSignOutAlt } from 'react-icons/fa'; // Importando ícone de logout do Font Awesome

/**
 * AppHeader Component
 *
 * @param {Object} props - As propriedades do componente.
 * @param {string} props.currentModule - O título do módulo atual a ser exibido no cabeçalho.
 * @param {function} [props.onMenuToggle] - Função opcional para lidar com o toggle do menu (para mobile).
 * @param {function} [props.onLogout] - Função opcional para lidar com o logout do usuário.
 */
export const AppHeader = ({ currentModule, onMenuToggle, onLogout }) => {
    // Estado para gerenciar a visibilidade da logo de fallback (GII)
    const [showFallbackLogo, setShowFallbackLogo] = useState(false);

    // Manipula erro no carregamento da imagem principal, exibindo a logo de fallback
    const handleImageError = () => {
        setShowFallbackLogo(true);
    };

    return (
        <header className="bg-gradient-to-r from-blue-700 to-blue-800 text-white p-4 shadow-xl flex items-center justify-between sticky top-0 z-40 border-b-2 border-blue-900 rounded-b-lg">
            {/* Contêiner da Logo e Título Principal */}
            <div className="flex items-center space-x-3">
                {/* Botão para abrir/fechar sidebar em telas pequenas */}
                {onMenuToggle && ( // Renderiza o botão apenas se onMenuToggle for fornecido
                    <button
                        onClick={onMenuToggle}
                        className="md:hidden p-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        aria-label="Abrir menu"
                    >
                        <LuMenu className="h-6 w-6" /> {/* Ícone de hambúrguer */}
                    </button>
                )}

                {/* Área da Logo: Imagem Principal (SVG) ou Fallback */}
                <div className="flex-shrink-0 flex items-center">
                    {!showFallbackLogo ? (
                        <img
                            src="/Logo-Mdias.svg" // Caminho para a imagem SVG local na pasta public
                            alt="Logo M. Dias Branco" // Alt text descritivo
                            className="h-10 w-auto rounded-full shadow-md" // Estilos para a logo
                            onError={handleImageError} // Chama a função de fallback em caso de erro
                        />
                    ) : (
                        // Fallback da logo (texto "GII" dentro de um círculo)
                        <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-blue-700 font-headline font-bold text-lg shadow-md">
                            GII
                        </div>
                    )}
                </div>

                {/* Título Principal da Aplicação */}
                <h1 className="text-xl md:text-2xl font-headline font-bold tracking-tight hidden sm:block">
                    Gestor Integrado Inteligente
                </h1>
            </div>

            {/* Módulo Atual e Botão de Sair */}
            <div className="flex items-center gap-4">
                <div className="text-sm sm:text-base font-body">
                    Módulo: <span className="font-semibold">{currentModule}</span>
                </div>
                {onLogout && ( // Renderiza o botão de logout apenas se onLogout for fornecido
                    <button
                        onClick={onLogout}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded-lg shadow-md hover:bg-blue-700 transition duration-200
                                   flex items-center gap-2 font-medium text-sm"
                        aria-label="Sair da aplicação"
                    >
                        <FaSignOutAlt className="text-base" /> Sair
                    </button>
                )}
            </div>
        </header>
    );
};
