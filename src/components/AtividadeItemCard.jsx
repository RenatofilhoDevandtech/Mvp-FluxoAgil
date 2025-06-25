import React from 'react';
// Importando ícones do Font Awesome via React Icons para um visual moderno e informativo
import {
    FaCalendarAlt, // Para calendário/data
    FaUser,        // Para usuário
    FaTag,         // Para tag/categoria
    FaInfoCircle,  // Para informação
    FaArrowRight,  // Para seta direita
    FaCheckCircle, // Para concluído
    FaExclamationCircle, // Para alerta/atenção (substituindo LuAlertCircle)
    FaClock,       // Para relógio/hora
    FaTimesCircle  // Para fechar/erro (substituindo LuXCircle)
} from 'react-icons/fa'; // Importado de 'react-icons/fa'

// Supondo que essas funções estejam definidas em ../utils/formatters.js
// Se não estiverem, precisarão ser criadas.
import { formatDate, dateDiffInDays } from '../utils/formatters.js';

/**
 * AtividadeItemCard Component
 * Exibe um card de resumo para uma atividade, com base em seu status e prazos.
 * O card é clicável para edição/visualização de detalhes.
 *
 * @param {Object} props - As propriedades do componente.
 * @param {Object} props.atividade - O objeto de atividade a ser exibido no card.
 * @param {function} props.onEdit - Callback para ser chamado quando o card é clicado para edição.
 */
export const AtividadeItemCard = ({ atividade, onEdit }) => {
    // Calcula a data de hoje e o prazo final para determinar a urgência
    const hoje = new Date().toISOString().split('T')[0];
    // Prioriza PrazoLimiteEmpresa, senão usa DataFim (para Agenda)
    const prazo = atividade.PrazoLimiteEmpresa || atividade.DataFim;
    const diasParaPrazo = prazo ? dateDiffInDays(hoje, prazo) : null;

    // Define estilos padrão para o card e texto de prazo
    let cardStyle = 'bg-white hover:bg-gray-50 border-gray-200';
    let prazoTextStyle = 'text-gray-700';
    // Usando FaCalendarAlt como padrão
    let prazoIcon = <FaCalendarAlt className="inline-block mr-1 text-gray-500" />;

    // Verifica se a atividade está concluída
    const isConcluido = atividade.status === 'Concluído' || atividade.status === 'Concluído em atraso';

    // Lógica para aplicar estilos baseados na proximidade do prazo e status
    if (!isConcluido && diasParaPrazo !== null) {
        if (diasParaPrazo < 0) {
            // Atrasado
            cardStyle = 'bg-red-50 hover:bg-red-100 border-red-300 shadow-md';
            prazoTextStyle = 'text-red-600 font-bold';
            prazoIcon = <FaExclamationCircle className="inline-block mr-1 text-red-500" />; // Usando FaExclamationCircle
        } else if (diasParaPrazo <= 7) {
            // Próximo ao prazo (até 7 dias)
            cardStyle = 'bg-yellow-50 hover:bg-yellow-100 border-yellow-300 shadow-md';
            prazoTextStyle = 'text-yellow-600 font-bold';
            prazoIcon = <FaExclamationCircle className="inline-block mr-1 text-yellow-500" />; // Usando FaExclamationCircle
        }
    } else if (isConcluido) {
        // Concluído (verde, com leve opacidade para indicar finalização)
        cardStyle = 'bg-green-50 hover:bg-green-100 border-green-300 opacity-90 shadow-md';
        prazoTextStyle = 'text-green-600'; // Cor do prazo para concluído
        prazoIcon = <FaCheckCircle className="inline-block mr-1 text-green-500" />; // Usando FaCheckCircle
    }

    // Função para determinar a cor do badge de status
    const getStatusColor = (status) => {
        switch(status) {
            case 'Concluído': return 'bg-green-100 text-green-800';
            case 'Concluído em atraso': return 'bg-red-100 text-red-800';
            case 'Em andamento': return 'bg-blue-100 text-blue-800';
            case 'Pendente': return 'bg-yellow-100 text-yellow-800';
            case 'Em aberto': return 'bg-gray-100 text-gray-800';
            case 'Aprovado': return 'bg-purple-100 text-purple-800';
            case 'Rejeitado': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-200 text-gray-800';
        }
    };

    return (
        // Contêiner principal do card, com estilos dinâmicos e sombra
        <div
            className={`p-4 rounded-xl shadow border transition-all duration-200 cursor-pointer flex flex-col justify-between h-full ${cardStyle}`}
            onClick={() => onEdit(atividade)} // Clique no card inteiro para edição
        >
            <div>
                {/* Cabeçalho do Card: Título e Categoria */}
                <div className="flex justify-between items-start mb-2">
                    <h3
                        className="text-lg font-headline font-bold text-blue-800 flex-grow mr-2 line-clamp-2"
                        title={atividade.titulo} // Tooltip para títulos longos
                    >
                        {atividade.titulo}
                    </h3>
                    {/* Categoria da atividade com ícone */}
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full font-medium flex-shrink-0 flex items-center gap-1">
                        <FaTag className="inline-block h-3 w-3" /> {atividade.categoria} {/* Usando FaTag */}
                    </span>
                </div>

                {/* Informações de Prazo */}
                {prazo && (
                    <p className={`text-sm mb-1 flex items-center ${prazoTextStyle}`}>
                        {prazoIcon}
                        Prazo: {formatDate(prazo, "dd/MMM/yyyy")}
                        {diasParaPrazo !== null && !isConcluido && (
                            <span className="ml-2 text-xs font-semibold">
                                ({diasParaPrazo === 0 ? 'Hoje' : diasParaPrazo < 0 ? `${Math.abs(diasParaPrazo)} dias atrasado` : `faltam ${diasParaPrazo} dias`})
                            </span>
                        )}
                    </p>
                )}

                {/* Informações de Data de Início (se houver) */}
                {atividade.DataInicio && (
                    <p className="text-sm text-gray-600 flex items-center mb-1">
                        <FaCalendarAlt className="inline-block mr-1 text-gray-500" /> {/* Usando FaCalendarAlt */}
                        Início: {formatDate(atividade.DataInicio, "dd/MMM/yyyy HH:mm")}
                    </p>
                )}

                {/* Informações do Responsável */}
                {atividade.responsavel_FK && atividade.responsavel_FK.NomeCompleto && (
                    <p className="text-sm text-gray-600 flex items-center">
                        <FaUser className="inline-block mr-1 text-gray-500" /> {/* Usando FaUser */}
                        Resp: <span className="font-medium ml-1">{atividade.responsavel_FK.NomeCompleto}</span>
                    </p>
                )}
                {/* Fallback caso responsável não esteja disponível */}
                {!atividade.responsavel_FK?.NomeCompleto && (
                    <p className="text-sm text-gray-500 flex items-center">
                        <FaInfoCircle className="inline-block mr-1 text-gray-400" /> {/* Usando FaInfoCircle */}
                        Responsável não atribuído
                    </p>
                )}

                {/* Badge de Status */}
                <div className="mt-3">
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(atividade.status)}`}>
                        {atividade.status}
                    </span>
                </div>
            </div>

            {/* Botão "Ver Detalhes" no rodapé do card */}
            {/* O onClick aqui previne a propagação para evitar o clique duplicado do card pai */}
            <button
                onClick={(e) => { e.stopPropagation(); onEdit(atividade); }}
                className="mt-4 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 self-end"
                aria-label={`Ver detalhes da atividade ${atividade.titulo}`}
            >
                Ver Detalhes <FaArrowRight className="h-4 w-4" /> {/* Usando FaArrowRight */}
            </button>
        </div>
    );
};
