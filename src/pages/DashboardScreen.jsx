import React, { useState, useEffect } from "react";
import { KpiCard } from "../components/KpiCard.jsx";
import { formatDate, dateDiffInDays } from "../utils/formatters.js";
// Importando ícones do Font Awesome via React Icons para um visual consistente
import {
    FaTachometerAlt, // Para Dashboard
    FaClock,         // Para Pendentes
    FaCheckCircle,   // Para Concluídas no Prazo
    FaExclamationCircle, // Para Com Atraso / Risco
    FaShieldAlt,     // Para Conformidade
    FaChartPie,      // Para Distribuição de Status
    FaChartLine,     // Para Tendência de Entregas
    FaExclamationTriangle, // Para Obrigações Críticas
    FaInfoCircle // Para Sem Dados
} from 'react-icons/fa';

export const DashboardScreen = ({ allAtividades }) => {
    // Estados para KPIs, obrigações críticas, distribuição de status e tendência de entregas
    const [kpis, setKpis] = useState({
        total: 0,
        pendentes: 0,
        noPrazo: 0,
        comAtraso: 0,
        conformidade: "0%",
    });
    const [obrigaCoesCriticas, setObrigaCoesCriticas] = useState([]);
    const [statusDistribution, setStatusDistribution] = useState({});
    const [tendenciaEntregas, setTendenciaEntregas] = useState([]);

    useEffect(() => {
        // Filtra apenas as atividades da categoria "Obrigações"
        const obrigacoes = allAtividades.filter(
            (a) => a.categoria === "Obrigações"
        );

        if (obrigacoes && obrigacoes.length > 0) {
            const total = obrigacoes.length;
            const hoje = new Date();
            // Normaliza a data de hoje para UTC para evitar problemas de fuso horário na comparação
            const hojeUTC = new Date(
                Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
            );

            // Calcula atividades pendentes (que não foram concluídas no prazo ou com atraso)
            const pendentesList = obrigacoes.filter(
                (o) => o.status !== "Concluído" && o.status !== "Concluído em atraso"
            );
            const pendentes = pendentesList.length;

            // Calcula atividades concluídas (no prazo ou com atraso)
            const concluidasList = obrigacoes.filter(
                (o) => o.status === "Concluído" || o.status === "Concluído em atraso"
            );
            // Calcula atividades concluídas no prazo
            const noPrazo = concluidasList.filter(
                (o) => o.status === "Concluído"
            ).length;

            // Calcula atividades com atraso (concluídas em atraso OU pendentes E com prazo vencido)
            const comAtraso = obrigacoes.filter(
                (o) =>
                    o.status === "Concluído em atraso" ||
                    (o.status !== "Concluído" &&
                     o.status !== "Concluído em atraso" &&
                     o.PrazoLimiteEmpresa &&
                     new Date(o.PrazoLimiteEmpresa) < hojeUTC)
            ).length;

            // Calcula o percentual de conformidade
            const conformidade =
                concluidasList.length > 0
                    ? ((noPrazo / concluidasList.length) * 100).toFixed(1) + "%"
                    : "N/A";

            // Atualiza o estado dos KPIs
            setKpis({ total, pendentes, noPrazo, comAtraso, conformidade });

            // Calcula Obrigações Críticas (pendentes e próximas do prazo, ou já atrasadas)
            const criticas = pendentesList
                .filter(
                    (o) =>
                        (o.PrazoLimiteEmpresa && new Date(o.PrazoLimiteEmpresa) >= hojeUTC) || // Próximas ou hoje
                        (o.PrazoLimiteEmpresa && new Date(o.PrazoLimiteEmpresa) < hojeUTC && o.status !== 'Concluído' && o.status !== 'Concluído em atraso') // Atrasadas e não concluídas
                )
                .sort(
                    (a, b) =>
                        new Date(a.PrazoLimiteEmpresa).getTime() -
                        new Date(b.PrazoLimiteEmpresa).getTime()
                )
                .slice(0, 5); // Pega apenas as 5 mais críticas/próximas
            setObrigaCoesCriticas(criticas);

            // Calcula a Distribuição de Status
            const dist = obrigacoes.reduce((acc, o) => {
                acc[o.status] = (acc[o.status] || 0) + 1;
                return acc;
            }, {});
            setStatusDistribution(dist);

            // Calcula a Tendência de Entregas Mensais
            const entregasPorMes = obrigacoes.reduce((acc, o) => {
                if (!o.DataReferencia) return acc; // Ignora se não houver data de referência
                const mesRef = formatDate(o.DataReferencia, "yyyy-MM"); // Formato para agrupar
                if (!acc[mesRef]) {
                    acc[mesRef] = {
                        mes: formatDate(o.DataReferencia, "MMM/yy"), // Formato para exibição (Ex: Jul/25)
                        entreguesNoPrazo: 0,
                        entreguesComAtraso: 0,
                        pendentesNaoEntreguesAposPrazo: 0,
                    };
                }
                if (o.status === "Concluído") {
                    acc[mesRef].entreguesNoPrazo++;
                } else if (o.status === "Concluído em atraso") {
                    acc[mesRef].entreguesComAtraso++;
                } else if (
                    o.PrazoLimiteEmpresa &&
                    new Date(o.PrazoLimiteEmpresa) < hojeUTC &&
                    o.status !== "Concluído" &&
                    o.status !== "Concluído em atraso"
                ) {
                    acc[mesRef].pendentesNaoEntreguesAposPrazo++;
                }
                return acc;
            }, {});
            setTendenciaEntregas(
                // Converte o objeto para array e ordena cronologicamente
                Object.values(entregasPorMes).sort((a, b) => {
                    // Mapeia meses abreviados para números para ordenação correta
                    const monthMap = {
                        jan: 0, fev: 1, mar: 2, abr: 3, mai: 4, jun: 5,
                        jul: 6, ago: 7, set: 8, out: 9, nov: 10, dez: 11,
                    };
                    const [m1Str, y1Str] = a.mes.split("/");
                    const [m2Str, y2Str] = b.mes.split("/");
                    const date1 = new Date(
                        parseInt("20" + y1Str),
                        monthMap[m1Str.toLowerCase()]
                    );
                    const date2 = new Date(
                        parseInt("20" + y2Str),
                        monthMap[m2Str.toLowerCase()]
                    );
                    return date1.getTime() - date2.getTime(); // Ordena por timestamp
                })
            );
        } else {
            // Reseta KPIs se não houver atividades
            setKpis({
                total: 0,
                pendentes: 0,
                noPrazo: 0,
                comAtraso: 0,
                conformidade: "0%",
            });
            setObrigaCoesCriticas([]);
            setStatusDistribution({});
            setTendenciaEntregas([]);
        }
    }, [allAtividades]); // allAtividades é a dependência do useEffect

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            {/* Título Principal do Dashboard */}
            <h2 className="text-3xl font-headline font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaTachometerAlt className="text-blue-600" /> Página Inicial - Visão Geral
            </h2>

            {/* Seção de KPIs de Obrigações Fiscais */}
            <h3 className="text-xl font-headline font-semibold text-gray-700 mb-4">
                Indicadores Chave de Obrigações Fiscais
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
                <KpiCard
                    title="Total de Obrigações"
                    value={kpis.total}
                    icon={<FaTachometerAlt />} // Ícone do Font Awesome
                    colorClass="text-blue-600"
                    bgColorClass="bg-blue-100"
                />
                <KpiCard
                    title="Pendentes"
                    value={kpis.pendentes}
                    icon={<FaClock />} // Ícone do Font Awesome
                    colorClass="text-yellow-600"
                    bgColorClass="bg-yellow-100"
                />
                <KpiCard
                    title="Concluídas no Prazo"
                    value={kpis.noPrazo}
                    icon={<FaCheckCircle />} // Ícone do Font Awesome
                    colorClass="text-green-600"
                    bgColorClass="bg-green-100"
                />
                <KpiCard
                    title="Com Atraso / Risco"
                    value={kpis.comAtraso}
                    icon={<FaExclamationCircle />} // Ícone do Font Awesome
                    colorClass="text-red-600"
                    bgColorClass="bg-red-100"
                />
                <KpiCard
                    title="Conformidade"
                    value={kpis.conformidade}
                    subtext="Concluídas no Prazo / Total Concluídas"
                    icon={<FaShieldAlt />} // Ícone do Font Awesome
                    colorClass="text-indigo-600"
                    bgColorClass="bg-indigo-100"
                />
            </div>

            {/* Seções de Gráficos e Listas (Distribuição, Tendência, Críticas) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"> {/* Ajustado gap */}
                {/* Card: Distribuição de Status */}
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                    <h3 className="text-xl font-headline font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <FaChartPie className="text-purple-600" /> Distribuição de Status
                    </h3>
                    {Object.keys(statusDistribution).length > 0 && kpis.total > 0 ? (
                        <div className="space-y-3"> {/* Ajustado espaçamento */}
                            {Object.entries(statusDistribution).map(([status, count]) => (
                                <div key={status}>
                                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                                        <span className="font-medium">{status}</span>
                                        <span className="font-semibold">
                                            {count} ({((count / kpis.total) * 100).toFixed(1)}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3.5"> {/* Altura ajustada */}
                                        <div
                                            className={`${
                                                status === "Concluído"
                                                    ? "bg-green-500"
                                                    : status === "Pendente" || status === "Em aberto"
                                                    ? "bg-yellow-500"
                                                    : status === "Em andamento" || status === "Aprovado"
                                                    ? "bg-blue-500"
                                                    : "bg-red-500" // Inclui "Concluído em atraso" e "Rejeitado"
                                            } h-3.5 rounded-full transition-all duration-300`} // Transição suave
                                            style={{ width: `${(count / kpis.total) * 100}%` }}
                                            title={`${status}: ${count} (${((count / kpis.total) * 100).toFixed(1)}%)`}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <FaInfoCircle className="text-gray-400 text-3xl mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Sem dados de distribuição para exibir.</p>
                        </div>
                    )}
                </div>

                {/* Card: Tendência de Entregas Mensais (Gráfico de Barras Simplificado) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                    <h3 className="text-xl font-headline font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <FaChartLine className="text-green-600" /> Tendência de Entregas Mensais
                    </h3>
                    {tendenciaEntregas.length > 0 ? (
                        <div className="h-60 sm:h-72 relative"> {/* Aumentei a altura para melhor visualização */}
                            <div className="flex justify-around items-end h-full border-b-2 border-gray-300 pb-2"> {/* Borda mais grossa */}
                                {tendenciaEntregas.map((item, index) => {
                                    const totalNoMes =
                                        item.entreguesNoPrazo +
                                        item.entreguesComAtraso +
                                        item.pendentesNaoEntreguesAposPrazo;
                                    const alturaMaxima = 200; // Altura máxima para as barras em pixels
                                    return (
                                        <div
                                            key={index}
                                            className="text-center text-xs w-1/5 sm:w-1/6 flex flex-col items-center h-full justify-end"
                                            title={`Mês: ${item.mes}\nNo Prazo: ${item.entreguesNoPrazo}\nCom Atraso: ${item.entreguesComAtraso}\nNão Entregue (Atrasado): ${item.pendentesNaoEntreguesAposPrazo}`}
                                        >
                                            {/* Barras do Gráfico */}
                                            <div className="flex flex-col-reverse w-6 sm:w-8 bg-gray-200 rounded-t-sm overflow-hidden h-full justify-end"> {/* Base cinza para a barra */}
                                                {item.pendentesNaoEntreguesAposPrazo > 0 && (
                                                    <div
                                                        className="bg-red-500 w-full"
                                                        style={{
                                                            height: `${
                                                                totalNoMes > 0
                                                                    ? (item.pendentesNaoEntreguesAposPrazo / totalNoMes) * alturaMaxima
                                                                    : 0
                                                            }px`,
                                                        }}
                                                        title={`Não Entregue (Vencido): ${item.pendentesNaoEntreguesAposPrazo}`}
                                                    ></div>
                                                )}
                                                {item.entreguesComAtraso > 0 && (
                                                    <div
                                                        className="bg-yellow-500 w-full" // Mudança para amarelo para "Com Atraso"
                                                        style={{
                                                            height: `${
                                                                totalNoMes > 0
                                                                    ? (item.entreguesComAtraso / totalNoMes) * alturaMaxima
                                                                    : 0
                                                            }px`,
                                                        }}
                                                        title={`Com Atraso: ${item.entreguesComAtraso}`}
                                                    ></div>
                                                )}
                                                {item.entreguesNoPrazo > 0 && (
                                                    <div
                                                        className="bg-green-500 w-full"
                                                        style={{
                                                            height: `${
                                                                totalNoMes > 0
                                                                    ? (item.entreguesNoPrazo / totalNoMes) * alturaMaxima
                                                                    : 0
                                                            }px`,
                                                        }}
                                                        title={`No Prazo: ${item.entreguesNoPrazo}`}
                                                    ></div>
                                                )}
                                            </div>
                                            <span className="mt-2 block text-gray-700 font-semibold">{item.mes}</span> {/* Mês */}
                                        </div>
                                    );
                                })}
                            </div>
                            {/* Legenda do Gráfico */}
                            <div className="flex flex-wrap justify-center space-x-4 mt-4 text-sm font-body">
                                <span className="flex items-center">
                                    <div className="w-3 h-3 bg-green-500 mr-1 rounded-sm"></div>No Prazo
                                </span>
                                <span className="flex items-center">
                                    <div className="w-3 h-3 bg-yellow-500 mr-1 rounded-sm"></div>Com Atraso
                                </span>
                                <span className="flex items-center">
                                    <div className="w-3 h-3 bg-red-500 mr-1 rounded-sm"></div>Não Entregue (Vencido)
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <FaInfoCircle className="text-gray-400 text-3xl mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Sem dados de tendência para exibir.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Seção: Obrigações Críticas */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                <h3 className="text-xl font-headline font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <FaExclamationTriangle className="text-orange-600" /> Obrigações Críticas (Pendentes, Próximas do Prazo ou Atrasadas)
                </h3>
                {obrigaCoesCriticas.length > 0 ? (
                    <ul className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar"> {/* Altura máxima e scrollbar */}
                        {obrigaCoesCriticas.map((ob) => (
                            <li
                                key={ob.id}
                                className="text-sm p-3 border-l-4 border-orange-500 bg-orange-50 rounded-r-lg flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm"
                            >
                                <div className="flex-grow mb-1 sm:mb-0">
                                    <p className="font-semibold text-orange-800">{ob.titulo}</p>
                                    <p className="text-gray-600 text-xs mt-0.5">
                                        Prazo: {formatDate(ob.PrazoLimiteEmpresa, "dd/MMM/yyyy")} - Resp:{" "}
                                        <span className="font-medium">{ob.responsavel_FK?.NomeCompleto || "N/A"}</span>
                                    </p>
                                </div>
                                <span className="text-xs bg-orange-200 text-orange-800 px-2.5 py-1 rounded-full font-bold flex-shrink-0">
                                    {dateDiffInDays(
                                        new Date().toISOString().split("T")[0],
                                        ob.PrazoLimiteEmpresa
                                    ) === 0
                                        ? "Hoje!"
                                        : dateDiffInDays(
                                            new Date().toISOString().split("T")[0],
                                            ob.PrazoLimiteEmpresa
                                        ) < 0
                                        ? `${Math.abs(dateDiffInDays(new Date().toISOString().split("T")[0], ob.PrazoLimiteEmpresa))} dias atrasado`
                                        : `${dateDiffInDays(
                                            new Date().toISOString().split("T")[0],
                                            ob.PrazoLimiteEmpresa
                                        )} dia(s)`}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-6">
                        <FaInfoCircle className="text-gray-400 text-3xl mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Nenhuma obrigação crítica encontrada no momento. Mantenha o excelente trabalho!</p>
                    </div>
                )}
            </div>
        </div>
    );
};
