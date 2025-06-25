import React, { useMemo, useState } from 'react';
// Importando ícones do Font Awesome via React Icons para um visual consistente
import { FaCalendarAlt, FaPlusCircle, FaRegCalendarCheck, FaRegClock, FaUser, FaInfoCircle, FaTrashAlt, FaExclamationTriangle } from 'react-icons/fa';
// Supondo que formatDate esteja definido em ../utils/formatters.js
import { formatDate } from '../utils/formatters.js'; // `dateDiffInDays` não é mais necessário aqui, pois a lógica de agrupamento lida com isso.

/**
 * AgendaScreen Component
 * Exibe a agenda de trabalho do usuário, agrupando itens por datas relevantes.
 *
 * @param {Object} props - As propriedades do componente.
 * @param {Array<Object>} props.allAtividades - Todas as atividades, para filtrar as de categoria 'Agenda'.
 * @param {function} props.onEdit - Callback para editar um item de agenda.
 * @param {function} [props.onAdd] - Callback opcional para adicionar um novo item (pode ser redirecionado para AtividadesScreen).
 * @param {function} [props.onDelete] - Callback opcional para excluir um item.
 */
export const AgendaScreen = ({ allAtividades, onEdit, onAdd, onDelete }) => {
    // Estados para gerenciar o modal de confirmação de exclusão
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Filtra e ordena apenas os itens de agenda
    const agendaItems = useMemo(() => {
        return allAtividades
            .filter((a) => a.categoria === "Agenda")
            .sort((a, b) => new Date(a.DataInicio) - new Date(b.DataInicio));
    }, [allAtividades]);

    // Função para agrupar itens da agenda por relevância de data
    const groupAgendaItemsByDate = (items) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normaliza para o início do dia atual

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const groups = {
            today: [],
            tomorrow: [],
            thisWeek: [], // Próximos 7 dias (excluindo hoje e amanhã)
            upcoming: [], // Futuros (depois de 7 dias)
            past: [],    // Passados
        };

        items.forEach(item => {
            const itemStartDate = new Date(item.DataInicio);
            itemStartDate.setHours(0, 0, 0, 0); // Normaliza para o início do dia do item

            const diffTime = itemStartDate.getTime() - today.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); // Diferença em dias

            if (diffDays === 0) {
                groups.today.push(item);
            } else if (diffDays === 1) {
                groups.tomorrow.push(item);
            } else if (diffDays > 1 && diffDays <= 7) {
                groups.thisWeek.push(item);
            } else if (diffDays > 7) {
                groups.upcoming.push(item);
            } else if (diffDays < 0) {
                groups.past.push(item);
            }
        });

        // Ordena cada grupo por DataInicio
        for (const key in groups) {
            groups[key].sort((a, b) => new Date(a.DataInicio) - new Date(b.DataInicio));
        }

        return groups;
    };

    const groupedAgenda = useMemo(() => groupAgendaItemsByDate(agendaItems), [agendaItems]);

    // Define a cor da borda do item da agenda com base no status ou urgência
    const getAgendaItemBorderColor = (item) => {
        if (item.status === "Pendente" || item.status === "Em aberto") {
            return "border-yellow-500"; // Pendente/Em aberto
        }
        if (new Date(item.DataFim || item.DataInicio) < new Date() && item.status !== "Concluído") {
            return "border-red-500"; // Atrasado
        }
        if (item.status === "Concluído") {
            return "border-green-500"; // Concluído
        }
        return "border-blue-500"; // Padrão
    };

    // Abre o modal de confirmação de exclusão
    const handleOpenConfirmDelete = (item, event) => {
        event.stopPropagation(); // Previne que o clique no botão ative o onEdit do card
        setItemToDelete(item);
        setShowConfirmDelete(true);
    };

    // Confirma a exclusão e chama o callback onDelete
    const handleConfirmDelete = () => {
        if (itemToDelete && onDelete) {
            onDelete(itemToDelete.id); // Chama a função de exclusão passada via props
            setItemToDelete(null);
            setShowConfirmDelete(false);
        }
    };

    // Cancela a exclusão
    const handleCancelDelete = () => {
        setItemToDelete(null);
        setShowConfirmDelete(false);
    };


    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* Cabeçalho da Página */}
            <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white sticky top-0 z-30 shadow-sm">
                <h2 className="text-2xl font-headline font-bold text-gray-800 mb-2 sm:mb-0 flex items-center gap-2">
                    <FaRegCalendarCheck className="text-blue-600" /> Agenda de Trabalho
                </h2>
                {onAdd && (
                    <button
                        onClick={onAdd}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200
                                   flex items-center gap-2 font-medium text-sm"
                        aria-label="Adicionar Novo Item de Agenda"
                    >
                        <FaPlusCircle className="text-lg" /> Adicionar Item de Agenda
                    </button>
                )}
            </div>

            {/* Mensagem de Desenvolvimento do Calendário (Aprimorada) */}
            <div className="p-4 bg-blue-50 border-t border-b border-blue-200 text-blue-800 font-body text-sm flex items-center gap-3 shadow-inner">
                <FaInfoCircle className="text-xl text-blue-500 flex-shrink-0" />
                <div>
                    <span className="font-semibold">Visualização de Calendário em Desenvolvimento:</span>
                    <p className="text-sm">
                        A funcionalidade de calendário interativo com arrastar e soltar está sendo construída para uma experiência mais visual.
                        Por enquanto, todos os itens de Agenda são exibidos nesta lista. Você pode criar e editar novos itens de Agenda
                        através do módulo 'Atividades' ou clicando no botão "Adicionar Item de Agenda" acima.
                    </p>
                </div>
            </div>

            {/* Lista de Itens da Agenda Agrupados */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6"> {/* Adicionado padding responsivo */}
                {Object.keys(groupedAgenda).map(groupKey => {
                    const groupTitleMap = {
                        today: "Hoje",
                        tomorrow: "Amanhã",
                        thisWeek: "Esta Semana (próximos 7 dias)",
                        upcoming: "Próximas Datas",
                        past: "Datas Passadas",
                    };
                    const title = groupTitleMap[groupKey];
                    const items = groupedAgenda[groupKey];

                    // Renderiza o grupo apenas se houver itens
                    if (items.length === 0) return null;

                    return (
                        <div key={groupKey}>
                            <h3 className="text-lg font-headline font-bold text-gray-700 mb-3 border-b pb-2">
                                {title}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> {/* Layout em grid */}
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`bg-white p-4 rounded-xl shadow-md border-l-4 hover:shadow-lg transition-all duration-200 cursor-pointer h-full flex flex-col justify-between
                                                    ${getAgendaItemBorderColor(item)}`}
                                        onClick={() => onEdit(item)}
                                    >
                                        <div>
                                            <h4 className="font-headline font-bold text-blue-700 text-base mb-1 line-clamp-1" title={item.titulo}>{item.titulo}</h4>

                                            <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                                                <FaCalendarAlt className="text-gray-500" />
                                                <span className="font-semibold">De:</span> {item.DataInicio ? formatDate(item.DataInicio, "dd/MM/yyyy") : "N/A"} <FaRegClock className="ml-2 text-gray-500" /> {item.DataInicio ? formatDate(item.DataInicio, "HH:mm") : "N/A"}
                                            </p>
                                            <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                                                <FaCalendarAlt className="text-gray-500" />
                                                <span className="font-semibold">Até:</span> {item.DataFim ? formatDate(item.DataFim, "dd/MM/yyyy") : "N/A"} <FaRegClock className="ml-2 text-gray-500" /> {item.DataFim ? formatDate(item.DataFim, "HH:mm") : "N/A"}
                                            </p>

                                            {item.responsavel_FK?.NomeCompleto && (
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <FaUser className="text-gray-500" />
                                                    <span className="font-semibold">Resp:</span> {item.responsavel_FK.NomeCompleto}
                                                </p>
                                            )}
                                            {item.descricao && (
                                                <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                                                    {item.descricao}
                                                </p>
                                            )}
                                        </div>
                                        {/* Botão de detalhes */}
                                        <div className="flex justify-between items-center mt-3">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                                                className="text-xs text-blue-500 hover:text-blue-700 font-semibold flex items-center gap-1"
                                                aria-label={`Ver detalhes de ${item.titulo}`}
                                            >
                                                Ver Detalhes
                                            </button>
                                            {onDelete && ( // Renderiza o botão de excluir apenas se a prop onDelete for fornecida
                                                <button
                                                    onClick={(e) => handleOpenConfirmDelete(item, e)}
                                                    className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"
                                                    aria-label={`Excluir item de agenda ${item.titulo}`}
                                                >
                                                    <FaTrashAlt className="text-sm" /> Excluir
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/* Mensagem se não houver itens de agenda */}
                {agendaItems.length === 0 && (
                    <div className="text-center p-8 bg-white rounded-lg shadow-md border border-gray-200">
                        <p className="text-gray-500 text-lg font-medium">Não há itens de agenda para exibir.</p>
                        <p className="text-gray-400 text-sm mt-2">Crie novos itens de agenda no módulo 'Atividades'.</p>
                        {onAdd && (
                             <button
                                onClick={onAdd}
                                className="mt-4 bg-blue-500 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-blue-600 transition duration-200
                                           flex items-center gap-2 mx-auto font-medium text-sm"
                                aria-label="Adicionar Novo Item de Agenda"
                            >
                                <FaPlusCircle className="text-lg" /> Adicionar Item de Agenda
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Modal de Confirmação de Exclusão */}
            {showConfirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
                        <FaExclamationTriangle className="text-yellow-500 text-5xl mx-auto mb-4" />
                        <h3 className="font-headline font-bold text-xl text-gray-800 mb-2">Confirmar Exclusão</h3>
                        <p className="text-gray-600 mb-6">
                            Você tem certeza que deseja excluir o item de agenda: "<span className="font-semibold">{itemToDelete?.titulo}</span>"? Esta ação não pode ser desfeita.
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
