import React, { useState, useMemo } from "react";
// Importando initialColaboradores para o filtro de responsável
import { initialColaboradores } from '../data/mockApi.js';
// Importando ícones do Font Awesome para um visual consistente
import { FaHistory, FaUser, FaFilter, FaInfoCircle, FaCalendarAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { formatDate } from "../utils/formatters.js";

/**
 * HistoricoScreen Component
 * Exibe o histórico de atividades concluídas (no prazo ou com atraso).
 * Permite filtrar por responsável e apresenta os itens em um formato de lista clara.
 *
 * @param {Object} props - As propriedades do componente.
 * @param {Array<Object>} props.allAtividades - Todas as atividades disponíveis na aplicação.
 */
export const HistoricoScreen = ({ allAtividades }) => {
    // Estado para o filtro de responsável
    const [responsavelFiltro, setResponsavelFiltro] = useState('');

    // Filtra e ordena as atividades para o histórico
    const filteredHistorico = useMemo(() => {
        let historicoData = allAtividades.filter(
            a => a.status === 'Concluído' || a.status === 'Concluído em atraso'
        );

        // Aplica o filtro de responsável
        if (responsavelFiltro) {
            historicoData = historicoData.filter(h => h.responsavel_FK?.id === responsavelFiltro);
        }

        // Ordena por data de conclusão (mais recente primeiro)
        historicoData.sort((a, b) => {
            const dateA = a.DataConclusao ? new Date(a.DataConclusao).getTime() : 0;
            const dateB = b.DataConclusao ? new Date(b.DataConclusao).getTime() : 0;
            return dateB - dateA; // Ordem decrescente (mais recente primeiro)
        });

        return historicoData;
    }, [allAtividades, responsavelFiltro]);

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* Cabeçalho da Página */}
            <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white sticky top-0 z-30 shadow-sm">
                <h2 className="text-2xl font-headline font-bold text-gray-800 mb-2 sm:mb-0 flex items-center gap-2">
                    <FaHistory className="text-blue-600" /> Histórico de Atividades
                </h2>
                {/* Filtro por Responsável */}
                <div className="flex items-center gap-2">
                    <FaFilter className="text-gray-500 text-lg flex-shrink-0" />
                    <label htmlFor="responsavel-filtro" className="text-sm font-medium text-gray-700 sr-only">Filtrar por Responsável:</label>
                    <select
                        id="responsavel-filtro"
                        value={responsavelFiltro}
                        onChange={e => setResponsavelFiltro(e.target.value)}
                        className="p-2.5 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
                        aria-label="Filtrar histórico por responsável"
                    >
                        <option value="">Todos os Responsáveis</option>
                        {initialColaboradores.map(c => (
                            <option key={c.id} value={c.id}>{c.NomeCompleto}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Conteúdo Principal: Lista do Histórico */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50">
                {filteredHistorico.length === 0 ? (
                    // Mensagem de estado vazio
                    <div className="text-center p-8 bg-white rounded-lg shadow-md border border-gray-200">
                        <FaInfoCircle className="text-blue-500 text-4xl mx-auto mb-4" />
                        <p className="text-gray-500 text-lg font-medium">Nenhuma atividade concluída encontrada.</p>
                        <p className="text-gray-400 text-sm mt-2">Ajuste seus filtros ou aguarde por novas conclusões.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> {/* Layout em grid para os cards */}
                        {filteredHistorico.map(item => (
                            <div
                                key={item.id}
                                className={`bg-white p-4 rounded-xl shadow-md border-l-4
                                            ${item.status === 'Concluído' ? 'border-green-500' : 'border-red-500'}
                                            hover:shadow-lg transition-all duration-200`}
                            >
                                <h3 className="font-headline font-bold text-gray-800 text-base mb-1 line-clamp-1" title={item.titulo}>
                                    {item.titulo}
                                </h3>
                                <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                                    {item.status === 'Concluído' ? <FaCheckCircle className="text-green-500" /> : <FaExclamationCircle className="text-red-500" />}
                                    Status: <span className="font-medium ml-1">{item.status}</span>
                                </p>
                                <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                                    <FaCalendarAlt className="text-gray-500" />
                                    Concluído em: <span className="font-medium ml-1">
                                        {item.DataConclusao ? formatDate(item.DataConclusao, "dd/MM/yyyy HH:mm") : "Data não informada"}
                                    </span>
                                </p>
                                <p className="text-xs text-gray-600 flex items-center gap-1">
                                    <FaUser className="text-gray-500" />
                                    Resp: <span className="font-medium ml-1">{item.responsavel_FK?.NomeCompleto || "Responsável não informado"}</span>
                                </p>
                                {item.categoria && (
                                    <p className="text-xs text-gray-500 mt-2">
                                        Categoria: {item.categoria} {item.subcategoria && `(${item.subcategoria})`}
                                    </p>
                                )}
                                {item.descricao && (
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                        {item.descricao}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
