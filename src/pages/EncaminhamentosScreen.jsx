import React, { useState, useMemo } from "react";
import { formatDate } from "../utils/formatters.js";
// Importando ícones do Font Awesome para um visual consistente
import {
    FaPaperPlane, FaSearch, FaPlusCircle, FaInfoCircle,
    FaExclamationTriangle, FaTimes, FaFire, FaCircle, FaTrashAlt,
    FaUser, // Adicionada a importação do FaUser
    FaCalendarAlt // Adicionada a importação do FaCalendarAlt
} from 'react-icons/fa';

/**
 * EncaminhamentosScreen Component
 * Exibe uma lista de encaminhamentos internos, com filtros de pesquisa e resumo de prioridades.
 * Permite adicionar e excluir encaminhamentos (com modais de confirmação).
 *
 * @param {Object} props - As propriedades do componente.
 * @param {Array<Object>} props.allAtividades - Todas as atividades, para filtrar encaminhamentos.
 * @param {function} props.onEdit - Callback para editar um encaminhamento.
 * @param {function} props.onAdd - Callback para adicionar um novo encaminhamento.
 * @param {function} [props.onDelete] - Callback opcional para excluir um encaminhamento.
 */
export const EncaminhamentosScreen = ({ allAtividades, onEdit, onAdd, onDelete }) => {
    // Estados para termo de pesquisa, e modais de confirmação
    const [searchTerm, setSearchTerm] = useState("");
    const [showConfirmAddModal, setShowConfirmAddModal] = useState(false); // Para modal de "Novo"
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Filtra e ordena os encaminhamentos com base no termo de pesquisa
    const encaminhamentos = useMemo(() => {
        return allAtividades
            .filter(a => a.categoria === "Encaminhamento")
            .filter(a =>
                a.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.responsavel_FK?.NomeCompleto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.Solicitante_FK?.NomeCompleto?.toLowerCase().includes(searchTerm.toLowerCase()) // Permite buscar pelo solicitante também
            )
            .sort((a, b) => {
                // Ordenação: primeiro por prioridade (Alta > Média > Baixa), depois por prazo limite
                const priorityOrder = { "Alta": 1, "Média": 2, "Baixa": 3, "Normal": 4, undefined: 5 };
                const prioA = priorityOrder[a.Prioridade] || 5;
                const prioB = priorityOrder[b.Prioridade] || 5;

                if (prioA !== prioB) return prioA - prioB;

                const dateA = a.PrazoLimiteEmpresa ? new Date(a.PrazoLimiteEmpresa).getTime() : Infinity;
                const dateB = b.PrazoLimiteEmpresa ? new Date(b.PrazoLimiteEmpresa).getTime() : Infinity;
                return dateA - dateB;
            });
    }, [allAtividades, searchTerm]);

    // Calcula o resumo de prioridades
    const stats = useMemo(() => {
        return encaminhamentos.reduce((acc, curr) => {
            const priority = curr.Prioridade || "Não Definida"; // Trata prioridades não definidas
            acc[priority] = (acc[priority] || 0) + 1;
            return acc;
        }, {});
    }, [encaminhamentos]);

    // Manipulador para o botão "Novo" (abre o modal de confirmação)
    const handleAddClick = () => {
        setShowConfirmAddModal(true);
    };

    // Confirma a adição de um novo encaminhamento
    const confirmAdd = () => {
        onAdd(); // Chama a função onAdd do App.jsx
        setShowConfirmAddModal(false);
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

    // Função auxiliar para obter a cor do texto/ícone de prioridade
    const getPriorityColorClass = (priority) => {
        switch (priority) {
            case "Alta": return "text-red-600";
            case "Média": return "text-yellow-600";
            case "Baixa": return "text-gray-500";
            default: return "text-gray-500";
        }
    };

    // Função auxiliar para obter o ícone de prioridade
    const getPriorityIcon = (priority) => {
        switch (priority) {
            case "Alta": return <FaFire className="text-red-500" />;
            case "Média": return <FaExclamationTriangle className="text-yellow-500" />;
            case "Baixa": return <FaCircle className="text-gray-400 text-[0.6rem]" />; // Tamanho menor
            default: return <FaInfoCircle className="text-gray-400" />;
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* Cabeçalho da Página */}
            <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white sticky top-0 z-30 shadow-sm">
                <h2 className="text-2xl font-headline font-bold text-gray-800 mb-2 sm:mb-0 flex items-center gap-2">
                    <FaPaperPlane className="text-blue-600" /> Encaminhamentos Internos
                </h2>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Pesquisar por título, solic. ou resp."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="p-2.5 pl-10 border border-gray-300 rounded-lg w-full text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            aria-label="Pesquisar encaminhamentos"
                        />
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    <button
                        onClick={handleAddClick} // Chama o manipulador que abre o modal
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200
                                   flex items-center gap-2 font-medium text-sm w-full sm:w-auto justify-center"
                        aria-label="Adicionar Novo Encaminhamento"
                    >
                        <FaPlusCircle className="text-lg" /> Novo Encaminhamento
                    </button>
                </div>
            </div>

            {/* Seção de Resumo de Prioridades */}
            <div className="p-4 bg-white border-b border-gray-200 shadow-inner">
                <h3 className="text-base font-semibold text-gray-700 mb-2">Resumo de Prioridades:</h3>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {Object.keys(stats).length > 0 ? (
                        Object.entries(stats).map(([priority, count]) => (
                            <span key={priority} className={`flex items-center text-sm font-semibold ${getPriorityColorClass(priority)}`}>
                                {getPriorityIcon(priority)}
                                <span className="ml-1">{priority}: {count}</span>
                            </span>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 italic">Sem prioridades para exibir.</p>
                    )}
                </div>
            </div>

            {/* Lista de Encaminhamentos */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 bg-gray-50">
                {encaminhamentos.length === 0 ? (
                    <div className="col-span-full text-center p-8 bg-white rounded-lg shadow-md border border-gray-200">
                        <FaInfoCircle className="text-blue-500 text-4xl mx-auto mb-4" />
                        <p className="text-gray-500 text-lg font-medium">Nenhum encaminhamento encontrado.</p>
                        <p className="text-gray-400 text-sm mt-2">Ajuste sua pesquisa ou adicione um novo encaminhamento.</p>
                        <button
                            onClick={handleAddClick}
                            className="mt-4 bg-blue-500 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-blue-600 transition duration-200
                                       flex items-center gap-2 mx-auto font-medium text-sm"
                            aria-label="Adicionar Novo Encaminhamento"
                        >
                            <FaPlusCircle className="text-lg" /> Adicionar Novo Encaminhamento
                        </button>
                    </div>
                ) : (
                    encaminhamentos.map(item => (
                        <div
                            key={item.id}
                            className={`bg-white p-4 rounded-xl shadow-md border-l-4 hover:shadow-lg transition-all duration-200 cursor-pointer h-full flex flex-col justify-between ${
                                item.Prioridade === "Alta" ? "border-red-500" :
                                item.Prioridade === "Média" ? "border-yellow-500" :
                                "border-gray-400" // Cor padrão para prioridade Baixa ou não definida
                            }`}
                            onClick={() => onEdit(item)}
                        >
                            <div>
                                <h3 className="font-headline font-bold text-blue-700 text-base mb-1 line-clamp-1" title={item.titulo}>
                                    {item.titulo} {item.Filial && `(Filial: ${item.Filial})`}
                                </h3>
                                <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                                    <FaUser className="text-gray-500" />
                                    Solic.: <span className="font-medium">{item.Solicitante_FK?.NomeCompleto || "N/A"}</span>
                                </p>
                                <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                                    <FaUser className="text-gray-500" />
                                    Resp. Atual: <span className="font-medium">{item.responsavel_FK?.NomeCompleto || "N/A"}</span>
                                </p>
                                <p className={`text-xs font-semibold flex items-center gap-1 ${
                                    new Date(item.PrazoLimiteEmpresa) < new Date() && item.status !== 'Concluído' ? "text-red-500" : "text-gray-500"
                                }`}>
                                    <FaCalendarAlt className="text-gray-500" />
                                    Prazo: {item.PrazoLimiteEmpresa ? formatDate(item.PrazoLimiteEmpresa, "dd/MM/yyyy") : "Data não informada"}
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 font-semibold">
                                        Status: {item.status || "N/A"}
                                    </span>
                                    {item.Prioridade && (
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                            item.Prioridade === "Alta" ? "bg-red-100 text-red-700" :
                                            item.Prioridade === "Média" ? "bg-yellow-100 text-yellow-700" :
                                            "bg-gray-100 text-gray-600" // Baixa ou não definida
                                        } font-semibold flex items-center gap-1`}>
                                            {getPriorityIcon(item.Prioridade)} Prioridade: {item.Prioridade}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {/* Botões de Ação do Card */}
                            <div className="flex justify-between items-center mt-3">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                                    className="text-xs text-blue-500 hover:text-blue-700 font-semibold flex items-center gap-1"
                                    aria-label={`Ver detalhes de ${item.titulo}`}
                                >
                                    Ver Detalhes
                                </button>
                                {onDelete && (
                                    <button
                                        onClick={(e) => handleOpenConfirmDelete(item, e)}
                                        className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"
                                        aria-label={`Excluir encaminhamento ${item.titulo}`}
                                    >
                                        <FaTrashAlt className="text-sm" /> Excluir
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal de Confirmação para Adicionar Novo Encaminhamento */}
            {showConfirmAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
                        <FaPlusCircle className="text-blue-500 text-5xl mx-auto mb-4" />
                        <h3 className="font-headline font-bold text-xl text-gray-800 mb-2">Novo Encaminhamento</h3>
                        <p className="text-gray-600 mb-6">
                            Você deseja criar um novo encaminhamento?
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setShowConfirmAddModal(false)}
                                className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition duration-200"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmAdd}
                                className="py-2 px-4 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-200"
                            >
                                Criar
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
                            Você tem certeza que deseja excluir o encaminhamento: "<span className="font-semibold">{itemToDelete?.titulo}</span>"? Esta ação não pode ser desfeita.
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