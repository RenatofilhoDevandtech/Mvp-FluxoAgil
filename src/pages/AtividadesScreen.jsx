import { useState, useEffect } from "react";
import { AtividadeItemCard } from "../components/AtividadeItemCard.jsx";
import { formatDate } from "../utils/formatters.js";
// Importando ícones do Font Awesome via React Icons para um visual consistente
import { FaPlusCircle, FaFileDownload, FaSearch, FaFilter, FaSpinner, FaInfoCircle, FaExclamationTriangle, FaTimes, FaRegListAlt } from 'react-icons/fa';

/**
 * AtividadesScreen Component
 * Tela principal para visualizar e gerenciar atividades abertas.
 * Inclui filtros, funcionalidade de geração de relatório e opções de adicionar/editar/excluir atividades.
 *
 * @param {Object} props - As propriedades do componente.
 * @param {function} props.onEdit - Callback para editar uma atividade.
 * @param {function} props.onAdd - Callback para adicionar uma nova atividade.
 * @param {Array<Object>} props.allAtividades - Todas as atividades disponíveis.
 * @param {Array<Object>} props.categorias - Lista de categorias para o filtro.
 * @param {Array<Object>} props.colaboradores - Lista de colaboradores para o filtro (passada para preencher o select de responsável).
 * @param {function} [props.onDelete] - Callback opcional para excluir uma atividade.
 */
export const AtividadesScreen = ({ onEdit, onAdd, allAtividades, categorias, colaboradores, onDelete }) => {
    // Estados para atividades filtradas, carregamento e filtros
    const [filteredAtividades, setFilteredAtividades] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // O filtro 'responsavel' agora armazenará o ID do colaborador selecionado
    const [filters, setFilters] = useState({ status: "", responsavel: "", categoria: "", search: "" });

    // Estados para os modais de confirmação
    const [showConfirmReportModal, setShowConfirmReportModal] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Opções de status (agora incluem os novos para consistência)
    const statusOptions = ["Em aberto", "Em andamento", "Pendente", "Concluído", "Concluído em atraso", "Aprovado", "Rejeitado"];


    // useEffect para aplicar filtros e ordenar atividades
    useEffect(() => {
        setIsLoading(true); // Inicia o estado de carregamento
        // Filtra atividades que não estejam concluídas (para "Atividades Abertas")
        let dados = allAtividades.filter(a => a.status !== "Concluído" && a.status !== "Concluído em atraso");

        // Aplica filtros dinamicamente
        if (filters.status) dados = dados.filter(o => o.status === filters.status);
        // Lógica de filtro para responsável: agora filtra pelo ID do responsável
        if (filters.responsavel) {
            dados = dados.filter(o => o.responsavel_FK?.id === filters.responsavel);
        }
        if (filters.categoria) dados = dados.filter(o => o.categoria === filters.categoria);
        if (filters.search) {
            dados = dados.filter(o =>
                o.titulo.toLowerCase().includes(filters.search.toLowerCase()) ||
                (o.descricao && o.descricao.toLowerCase().includes(filters.search.toLowerCase()))
            );
        }

        // Ordenação automática por prazo (Prioriza PrazoLimiteEmpresa, senão DataReferencia, senão DataInicio)
        dados.sort((a, b) => {
            const dateA = new Date(a.PrazoLimiteEmpresa || a.DataReferencia || a.DataInicio);
            const dateB = new Date(b.PrazoLimiteEmpresa || b.DataReferencia || b.DataInicio);
            return dateA.getTime() - dateB.getTime();
        });

        // Simula um pequeno atraso para UX (como se estivesse buscando dados)
        const timer = setTimeout(() => {
            setFilteredAtividades(dados);
            setIsLoading(false);
        }, 300); // Atraso de 300ms para simular carregamento

        return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado ou filtros mudarem
    }, [filters, allAtividades]); // Dependências do useEffect

    // Manipulador para o botão "Gerar Relatório"
    const handleGenerateReportClick = () => {
        setShowConfirmReportModal(true); // Abre o modal de confirmação
    };

    // Lógica para gerar o relatório CSV
    const confirmGenerateReport = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Titulo,Responsavel,Status,Categoria,Subcategoria,PrazoLimite,DataReferencia,DataInicio,DataFim,Descricao\r\n"; // Cabeçalho expandido

        filteredAtividades.forEach(item => {
            const row = [
                `"${item.titulo ? item.titulo.replace(/"/g, '""') : ''}"`, // Trata aspas duplas no título
                `"${item.responsavel_FK?.NomeCompleto ? item.responsavel_FK.NomeCompleto.replace(/"/g, '""') : 'N/A'}"`, // Trata aspas duplas e fallback
                item.status || "N/A",
                item.categoria || "N/A",
                item.subcategoria || "",
                item.PrazoLimiteEmpresa ? formatDate(item.PrazoLimiteEmpresa, "dd/MM/yyyy") : "",
                item.DataReferencia ? formatDate(item.DataReferencia, "dd/MM/yyyy") : "",
                item.DataInicio ? formatDate(item.DataInicio, "dd/MM/yyyy HH:mm") : "",
                item.DataFim ? formatDate(item.DataFim, "dd/MM/yyyy HH:mm") : "",
                `"${item.descricao ? item.descricao.replace(/"/g, '""') : ''}"`, // Trata aspas duplas na descrição
            ].join(",");
            csvContent += row + "\r\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "relatorio_atividades.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setShowConfirmReportModal(false); // Fecha o modal após a geração
    };

    // Abre o modal de confirmação de exclusão
    const handleOpenConfirmDelete = (item, event) => {
        event.stopPropagation(); // Previne que o clique no botão ative o onEdit do card
        setItemToDelete(item);
        setShowConfirmDeleteModal(true);
    };

    // Confirma a exclusão e chama o callback onDelete
    const handleConfirmDelete = () => {
        if (itemToDelete && onDelete) {
            onDelete(itemToDelete.id); // Chama a função de exclusão passada via props
            setItemToDelete(null);
            setShowConfirmDeleteModal(false);
        }
    };

    // Cancela a exclusão
    const handleCancelDelete = () => {
        setItemToDelete(null);
        setShowConfirmDeleteModal(false);
    };

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* Cabeçalho da Página */}
            <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white sticky top-0 z-30 shadow-sm">
                <h2 className="text-2xl font-headline font-bold text-gray-800 mb-2 sm:mb-0 flex items-center gap-2">
                    <FaRegListAlt className="text-blue-600" /> Atividades Abertas
                </h2>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                        onClick={handleGenerateReportClick} // Abre o modal de confirmação
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-800 transition duration-200
                                   flex items-center gap-2 font-medium text-sm w-full sm:w-auto justify-center"
                        aria-label="Gerar Relatório de Atividades"
                    >
                        <FaFileDownload className="text-lg" /> Gerar Relatório
                    </button>
                    <button
                        onClick={onAdd}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200
                                   flex items-center gap-2 font-medium text-sm w-full sm:w-auto justify-center"
                        aria-label="Adicionar Nova Atividade"
                    >
                        <FaPlusCircle className="text-lg" /> Nova Atividade
                    </button>
                </div>
            </div>

            {/* Seção de Filtros */}
            <div className="p-4 bg-white border-b border-gray-200 shadow-inner flex flex-col lg:flex-row gap-3 lg:gap-4 items-center">
                <FaFilter className="text-gray-500 text-xl hidden lg:block flex-shrink-0" /> {/* Ícone de filtro */}
                <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="p-2.5 border border-gray-300 rounded-lg w-full lg:w-auto text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Filtrar por Status"
                >
                    <option value="">Todos os Status</option>
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <select
                    value={filters.categoria}
                    onChange={(e) => setFilters({ ...filters, categoria: e.target.value })}
                    className="p-2.5 border border-gray-300 rounded-lg w-full lg:w-auto text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Filtrar por Categoria"
                >
                    <option value="">Todas as Categorias</option>
                    {categorias.map(c => <option key={c.id || c.nome} value={c.nome}>{c.nome}</option>)}
                </select>

                {/* SELECT DE FILTRO POR RESPONSÁVEL - SUBSTITUI O INPUT DE TEXTO */}
                <select
                    value={filters.responsavel}
                    onChange={(e) => setFilters({ ...filters, responsavel: e.target.value })}
                    className="p-2.5 border border-gray-300 rounded-lg w-full lg:w-auto text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Filtrar por Responsável"
                >
                    <option value="">Todos os Responsáveis</option>
                    {colaboradores && colaboradores.length > 0 ? (
                        colaboradores.map(c => (
                            <option key={c.id} value={c.id}>{c.NomeCompleto}</option>
                        ))
                    ) : (
                        <option value="" disabled>Carregando colaboradores...</option>
                    )}
                </select>
                
                <div className="relative w-full lg:w-auto flex-grow"> {/* Input de Pesquisa por Título/Descrição */}
                    <input
                        type="text"
                        placeholder="Pesquisar Título ou Descrição"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="p-2.5 pl-10 border border-gray-300 rounded-lg w-full text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        aria-label="Pesquisar por título ou descrição"
                    />
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {/* Conteúdo Principal: Lista de Atividades */}
            {isLoading ? (
                // Indicador de Carregamento
                <div className="flex items-center justify-center h-full text-lg text-gray-600 py-10">
                    <FaSpinner className="animate-spin h-6 w-6 text-blue-500 mr-3" />
                    A carregar atividades...
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 bg-gray-50"> {/* Ajustado gap e padding */}
                    {filteredAtividades.length > 0 ? (
                        // Mapeia e renderiza os cards de atividade
                        filteredAtividades.map(atv => (
                            <AtividadeItemCard
                                key={atv.id}
                                atividade={atv}
                                onEdit={onEdit}
                                onDelete={onDelete ? (e) => handleOpenConfirmDelete(atv, e) : null} // Passa a função de exclusão
                            />
                        ))
                    ) : (
                        // Mensagem de estado vazio
                        <div className="col-span-full text-center p-8 bg-white rounded-lg shadow-md border border-gray-200">
                            <FaInfoCircle className="text-blue-500 text-4xl mx-auto mb-4" />
                            <p className="text-gray-500 text-lg font-medium">Nenhuma atividade aberta encontrada.</p>
                            <p className="text-gray-400 text-sm mt-2">Ajuste seus filtros ou adicione uma nova atividade.</p>
                            {onAdd && (
                                <button
                                    onClick={onAdd}
                                    className="mt-4 bg-blue-500 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-blue-600 transition duration-200
                                               flex items-center gap-2 mx-auto font-medium text-sm"
                                    aria-label="Adicionar Nova Atividade"
                                >
                                    <FaPlusCircle className="text-lg" /> Adicionar Nova Atividade
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Modal de Confirmação para Gerar Relatório */}
            {showConfirmReportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
                        <FaFileDownload className="text-blue-500 text-5xl mx-auto mb-4" />
                        <h3 className="font-headline font-bold text-xl text-gray-800 mb-2">Gerar Relatório de Atividades</h3>
                        <p className="text-gray-600 mb-6">
                            Você deseja gerar o relatório das atividades filtradas como um arquivo CSV?
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setShowConfirmReportModal(false)}
                                className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition duration-200"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmGenerateReport}
                                className="py-2 px-4 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-200"
                            >
                                Gerar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Confirmação de Exclusão */}
            {showConfirmDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
                        <FaExclamationTriangle className="text-yellow-500 text-5xl mx-auto mb-4" />
                        <h3 className="font-headline font-bold text-xl text-gray-800 mb-2">Confirmar Exclusão</h3>
                        <p className="text-gray-600 mb-6">
                            Você tem certeza que deseja excluir a atividade: "<span className="font-semibold">{itemToDelete?.titulo}</span>"? Esta ação não pode ser desfeita.
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={handleCancelDelete}
                                className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition duration-200"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="py-2 px-4 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 transition duration-200"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
