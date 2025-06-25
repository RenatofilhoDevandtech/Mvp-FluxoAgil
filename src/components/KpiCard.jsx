import React from 'react';

/**
 * KpiCard Component
 * Exibe um cartão de Indicador Chave de Performance (KPI) com título, valor, subtexto e um ícone.
 * Projetado para ser usado em dashboards para uma visão rápida e impactante dos dados.
 *
 * @param {Object} props - As propriedades do componente.
 * @param {string} props.title - O título do KPI (ex: "Tarefas Concluídas").
 * @param {string|number} props.value - O valor principal do KPI (ex: "15", "R$ 1.200").
 * @param {string} [props.subtext] - Um texto adicional para contexto (ex: "últimos 30 dias", "meta 20").
 * @param {React.ReactNode} [props.icon] - Um elemento React (geralmente um ícone Lucide) a ser exibido.
 * @param {string} [props.colorClass="text-blue-600"] - Classe Tailwind para a cor do ícone e do valor principal.
 * @param {string} [props.bgColorClass="bg-blue-100"] - Classe Tailwind para a cor de fundo do círculo do ícone.
 */
export const KpiCard = ({
    title,
    value,
    subtext,
    icon,
    colorClass = "text-blue-600", // Alterado para um tom de azul mais profundo
    bgColorClass = "bg-blue-100",
}) => {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300
                    flex items-center space-x-5 border border-gray-100 transform hover:-translate-y-1"> {/* Adicionadas novas classes */}
            {/* Contêiner do Ícone */}
            {icon && (
                <div className={`${colorClass} ${bgColorClass} p-4 rounded-full flex-shrink-0
                                flex items-center justify-center text-3xl shadow-md`}> {/* Aumentei padding e tamanho do texto */}
                    {icon}
                </div>
            )}
            
            {/* Conteúdo do KPI: Título, Valor e Subtexto */}
            <div>
                <p className="text-sm md:text-base text-gray-500 font-body mb-0.5">{title}</p> {/* Ajustado tamanho e fonte */}
                <p className="text-3xl md:text-4xl font-headline font-bold text-gray-800 leading-none">{value}</p> {/* Aumentado tamanho, fonte de destaque */}
                {subtext && <p className="text-xs md:text-sm text-gray-500 mt-1 font-body">{subtext}</p>} {/* Ajustado tamanho e fonte */}
            </div>
        </div>
    );
};
