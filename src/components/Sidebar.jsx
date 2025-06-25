import React from 'react';
// Importando ícones do Font Awesome via React Icons para um visual moderno e consistente
import {
    FaTachometerAlt, // Para Dashboard (alternativa para LuLayoutDashboard)
    FaListAlt,       // Para Atividades (alternativa para LuClipboardList)
    FaCalendarAlt,   // Para Agenda (alternativa para LuCalendarCheck)
    FaPaperPlane,    // Para Encaminhamentos (alternativa para LuSend)
    FaHistory,       // Para Histórico (alternativa para LuHistory)
    FaCog,           // Para Admin (alternativa para LuSettings)
    FaTimes          // Para fechar menu (alternativa para LuX)
} from 'react-icons/fa'; // Agora todos os ícones são importados de 'react-icons/fa'

/**
 * Sidebar Component
 * Componente de barra lateral de navegação para o GII.
 * Gerencia a navegação entre as diferentes seções da aplicação.
 *
 * @param {Object} props - As propriedades do componente.
 * @param {function} props.onNavigate - Função de callback para mudar a página atual.
 * @param {string} props.currentPage - O ID da página atualmente ativa.
 * @param {boolean} props.isMenuOpen - Controla a visibilidade da sidebar em telas pequenas.
 * @param {function} props.onCloseMenu - Callback para fechar a sidebar em telas pequenas.
 */
export const Sidebar = ({ onNavigate, currentPage, isMenuOpen, onCloseMenu }) => {
    // Definição dos módulos de navegação com seus nomes, IDs e ícones Font Awesome
    const modules = [
        { name: 'Página Inicial', id: 'dashboard', icon: <FaTachometerAlt className="h-5 w-5" /> },
        { name: 'Atividades', id: 'atividades', icon: <FaListAlt className="h-5 w-5" /> },
        { name: 'Agenda', id: 'agenda', icon: <FaCalendarAlt className="h-5 w-5" /> },
        { name: 'Encaminhamentos', id: 'encaminhamentos', icon: <FaPaperPlane className="h-5 w-5" /> },
        { name: 'Histórico', id: 'historico', icon: <FaHistory className="h-5 w-5" /> },
        { name: 'Administração', id: 'admin', icon: <FaCog className="h-5 w-5" /> },
    ];

    return (
        <>
            {/* Overlay escuro para quando o menu está aberto em mobile */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={onCloseMenu} // Fecha o menu ao clicar no overlay
                    aria-hidden="true" // Oculta para leitores de tela
                ></div>
            )}

            {/* Sidebar principal */}
            <aside
                className={`fixed inset-y-0 left-0 bg-gray-800 text-white p-4 space-y-2
                           transform transition-transform duration-300 ease-in-out z-40
                           md:relative md:translate-x-0 md:w-64 md:flex-shrink-0
                           ${isMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}
                           overflow-y-auto custom-scrollbar rounded-r-xl shadow-2xl md:shadow-lg`} // Adicionado sombra e arredondamento
            >
                {/* Título do Menu para telas maiores ou quando o menu está aberto */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-headline font-bold text-gray-100">Menu GII</h2>
                    {/* Botão para fechar o menu em mobile (visível apenas em telas pequenas) */}
                    <button
                        onClick={onCloseMenu}
                        className="md:hidden p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 text-white transition duration-200"
                        aria-label="Fechar menu"
                    >
                        <FaTimes className="h-6 w-6" /> {/* Ícone de fechar do Font Awesome */}
                    </button>
                </div>

                {/* Lista de módulos de navegação */}
                <nav className="space-y-1">
                    {modules.map(mod => (
                        <button
                            key={mod.id}
                            onClick={() => {
                                onNavigate(mod.id);
                                onCloseMenu(); // Fecha o menu após a navegação em mobile
                            }}
                            title={mod.name} // Tooltip para o nome do módulo
                            className={`w-full flex items-center px-4 py-3 rounded-lg text-lg font-body font-medium
                                        hover:bg-blue-600 hover:text-white transition-all duration-200 ease-in-out
                                        ${currentPage === mod.id
                                            ? 'bg-blue-700 text-white shadow-md' // Estilo para item ativo
                                            : 'text-gray-300 hover:text-white' // Estilo para item inativo
                                        }
                                        group`} // Adicionado grupo para efeitos de hover no ícone
                            aria-current={currentPage === mod.id ? 'page' : undefined} // Acessibilidade para a página atual
                        >
                            {/* Ícone do módulo */}
                            <span className={`flex-shrink-0 mr-3 text-2xl
                                            ${currentPage === mod.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}
                                            transition-colors duration-200`}>
                                {mod.icon}
                            </span>
                            {/* Nome do módulo (sempre visível no menu expandido) */}
                            <span className="flex-grow text-left">{mod.name}</span>
                        </button>
                    ))}
                </nav>
            </aside>
        </>
    );
};
