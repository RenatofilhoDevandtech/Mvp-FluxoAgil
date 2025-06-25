import { AppHeader } from "./components/AppHeader.jsx";
import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "./components/Sidebar.jsx";
import { GenericFormModal } from "./components/GenericFormModal.jsx";
import { AtividadeFormFields } from "./components/AtividadeFormFields.jsx";
import { DashboardScreen } from "./pages/DashboardScreen.jsx";
import { AtividadesScreen } from "./pages/AtividadesScreen.jsx";
import { AgendaScreen } from "./pages/AgendaScreen.jsx";
import { EncaminhamentosScreen } from "./pages/EncaminhamentosScreen.jsx";
import { HistoricoScreen } from "./pages/HistoricoScreen.jsx";
import { AdminScreen } from "./pages/AdminScreen.jsx";
import { LoginPage } from "./pages/LoginPages.jsx";
import { mockApi, initialColaboradores } from "./data/mockApi.js";

// Componente principal da aplicação
function App() {
    // Estados para gerenciar a página atual, modal, item em edição, dados de atividades e categorias
    const [currentPage, setCurrentPage] = useState("dashboard");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [allAtividades, setAllAtividades] = useState([]);
    const [categorias, setCategorias] = useState([]);
    // Novos estados para gerenciar o carregamento de dados e possíveis erros
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // Novo estado para controlar a visibilidade da sidebar em mobile
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // Novo estado para controle de autenticação
    // Pode começar como 'true' para desenvolvimento rápido, mas deve ser 'false' em produção
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false); // Para o estado de carregamento do login

    // Mapeamento de IDs das páginas para títulos exibíveis no cabeçalho
    const moduleTitles = {
        dashboard: "Página Inicial",
        atividades: "Atividades",
        agenda: "Agenda",
        encaminhamentos: "Encaminhamentos",
        historico: "Histórico de Atividades",
        admin: "Administração",
    };

    // Função para buscar todos os dados necessários da API
    // Usamos useCallback para memorizar a função e evitar recriações desnecessárias
    const fetchAllData = useCallback(async () => {
        try {
            setIsLoading(true); // Inicia o estado de carregamento
            setError(null); // Limpa quaisquer erros anteriores
            const actividadesData = await mockApi.getAtividades({});
            const categoriasData = await mockApi.getCategorias();
            setAllAtividades(actividadesData);
            setCategorias(categoriasData);
        } catch (err) {
            console.error("Erro ao buscar dados:", err);
            // Define uma mensagem de erro amigável para o usuário
            setError("Ocorreu um erro ao carregar os dados. Por favor, tente novamente.");
        } finally {
            setIsLoading(false); // Finaliza o estado de carregamento, independentemente do sucesso ou falha
        }
    }, []);

    // useEffect para chamar fetchAllData uma vez na montagem do componente
    // Só busca os dados se o usuário estiver logado
    useEffect(() => {
        if (isLoggedIn) {
            fetchAllData();
        }
    }, [fetchAllData, isLoggedIn]); // fetchAllData e isLoggedIn são dependências do useEffect

    // Manipula a navegação entre as páginas
    const handleNavigate = (pageId) => {
        setCurrentPage(pageId);
        setIsModalOpen(false); // Fecha o modal ao navegar
        setIsSidebarOpen(false); // Fecha a sidebar em mobile ao navegar
    };

    // Manipula o toggle da sidebar (abrir/fechar)
    const handleToggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    // Manipula o fechamento da sidebar
    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };

    // Abre o modal para adicionar um novo item (atividade)
    const handleAddItem = () => {
        setEditingItem(null); // Limpa o item em edição
        setIsModalOpen(true);
    };

    // Abre o modal para editar um item existente
    const handleEditItem = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    // Salva ou atualiza um item (atividade) através da API mockada e recarrega os dados
    const handleSaveItem = async (itemData) => {
        await mockApi.saveAtividade(itemData);
        await fetchAllData(); // Recarrega os dados para refletir a mudança
    };

    // Exclui um item (atividade) através da API mockada e recarrega os dados
    const handleDeleteItem = async (id) => {
        await mockApi.deleteAtividade(id);
        await fetchAllData(); // Recarrega os dados para refletir a mudança
    };

    // Salva ou atualiza uma categoria através da API mockada e recarrega os dados
    const handleSaveCategoria = async (catData) => {
        await mockApi.saveCategoria(catData);
        await fetchAllData(); // Recarrega os dados para refletir a mudança
    };

    // Manipula o sucesso do login
    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        setIsAuthenticating(false);
        // Após o login, a fetchAllData será disparada pelo useEffect
    };

    // Manipula o logout do usuário
    const handleLogout = async () => {
        try {
            await mockApi.logout(); // Chama a API de logout
            setIsLoggedIn(false); // Define o estado de não logado
            setCurrentPage('dashboard'); // Opcional: define uma página inicial padrão após logout
        } catch (err) {
            console.error("Erro ao fazer logout:", err);
            // Poderia mostrar uma mensagem de erro para o usuário
        }
    };

    // Renderiza o componente da página atual com base no estado `currentPage`
    const renderCurrentPage = () => {
        // Exibe mensagens de carregamento ou erro antes de renderizar as páginas
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-lg text-gray-600">
                    {/* Ícone de spinner SVG simples para indicar carregamento */}
                    <svg className="animate-spin h-8 w-8 text-blue-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Carregando dados...
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-red-700 bg-red-100 border border-red-200 rounded-lg p-8 text-center shadow-md max-w-md mx-auto">
                    <span className="font-semibold text-xl mb-4">Ops! Ocorreu um erro.</span>
                    <p className="text-lg">{error}</p>
                    <button
                        onClick={fetchAllData}
                        className="mt-6 px-6 py-2 bg-blue-600 text-white font-body font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Tentar Novamente
                    </button>
                </div>
            );
        }

        // Renderiza a página específica após o carregamento e sem erros
        switch (currentPage) {
            case "dashboard":
                return <DashboardScreen allAtividades={allAtividades} />;
            case "atividades":
                return (
                    <AtividadesScreen
                        onEdit={handleEditItem}
                        onAdd={handleAddItem}
                        onDelete={handleDeleteItem} // Passa a função de exclusão
                        allAtividades={allAtividades}
                        categorias={categorias}
                        colaboradores={initialColaboradores} // Passa colaboradores para o filtro
                    />
                );
            case "agenda":
                return <AgendaScreen allAtividades={allAtividades} onEdit={handleEditItem} onDelete={handleDeleteItem} />; // Passa a função de exclusão
            case "encaminhamentos": {
                // Filtra atividades para encaminhamentos
                const encaminhamentos = allAtividades.filter((a) => a.categoria === "Encaminhamento");
                return (
                    <EncaminhamentosScreen
                        allAtividades={encaminhamentos}
                        onEdit={handleEditItem}
                        onAdd={handleAddItem}
                        onDelete={handleDeleteItem} // Passa a função de exclusão
                    />
                );
            }
            case "historico": {
                // Filtra atividades para histórico (concluídas ou concluídas em atraso)
                const historico = allAtividades.filter((a) => a.status === "Concluído" || a.status === "Concluído em atraso");
                return <HistoricoScreen allAtividades={historico} />;
            }
            case "admin":
                return <AdminScreen categorias={categorias} onSaveCategoria={handleSaveCategoria} />;
            default:
                // Mensagem padrão caso nenhuma página seja selecionada ou haja um erro na seleção
                return <div className="p-4 text-gray-600 font-body">Selecione uma opção no menu lateral.</div>;
        }
    };

    // Prepara os dados iniciais para o formulário do modal
    const getFormInitialData = () => {
        if (editingItem) return editingItem;
        return {
            responsavel_FK: null,
            status: "Em aberto",
            categoria: "Atividade Extra", // Valor padrão para nova atividade
        };
    };

    // Renderização condicional baseada no status de autenticação
    if (!isLoggedIn) {
        return (
            <LoginPage
                onLoginSuccess={handleLoginSuccess}
                isLoading={isAuthenticating}
                setIsLoading={setIsAuthenticating} // Permite que LoginPage controle seu próprio estado de carregamento
            />
        );
    }

    return (
        // Contêiner principal da aplicação com layout flexível para cabeçalho, sidebar e conteúdo
        <div className="h-screen flex flex-col antialiased text-gray-900 bg-gray-100 font-body">
            {/* Cabeçalho da aplicação, exibindo o título do módulo atual e o toggle do menu */}
            <AppHeader
                currentModule={moduleTitles[currentPage] || "Visão Geral"}
                onMenuToggle={handleToggleSidebar} // Passa o manipulador para o cabeçalho
                onLogout={handleLogout} // Passa o manipulador de logout
            />
            
            {/* Área de conteúdo principal (sidebar e main content) */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar para navegação */}
                <Sidebar
                    onNavigate={handleNavigate}
                    currentPage={currentPage}
                    isMenuOpen={isSidebarOpen} // Passa o estado de abertura da sidebar
                    onCloseMenu={handleCloseSidebar} // Passa o manipulador para fechar a sidebar
                />
                
                {/* Conteúdo principal, com rolagem vertical automática e padding */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-white shadow-inner">
                    {renderCurrentPage()}
                </main>
            </div>
            
            {/* Modal genérico para formulários de adição/edição */}
            {isModalOpen && (
                <GenericFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveItem}
                    title={editingItem ? "Editar Atividade" : "Nova Atividade"}
                    initialData={getFormInitialData()}
                    // Renderiza o componente de campos do formulário de atividade dentro do modal
                    formFieldsComponent={(props) => (
                        <AtividadeFormFields {...props} categorias={categorias || []} colaboradores={initialColaboradores} />
                    )}
                />
            )}
        </div>
    );
}

export default App;
