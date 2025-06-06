// App.js - Simulação da Suite de Gestão Integrada com Múltiplos Módulos
// Foco principal no módulo de Obrigações Acessórias, com estrutura para os demais e Dashboard.

import React, { useState, useEffect, useCallback } from 'react';
import LogoMdias from './assets/Logo-Mdias.svg';
// --- Configuração e Utilitários Globais ---
const formatDate = (dateString, format = "dd/mmm/yyyy") => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        // Ajuste para garantir que a data local seja usada consistentemente ao converter de string
        // É crucial que o dateString de entrada seja interpretado corretamente.
        // Se o dateString não tiver informação de fuso, new Date() pode interpretá-lo como UTC ou local, dependendo do formato.
        // Para inputs 'date' (YYYY-MM-DD), são geralmente interpretados como UTC meia-noite.
        // Para inputs 'datetime-local' (YYYY-MM-DDTHH:mm), são interpretados na timezone local.
        
        let adjustedDate = date;
        // Se o dateString for apenas data (YYYY-MM-DD), a conversão para new Date() pode resultar na meia-noite UTC.
        // Adicionar o offset do fuso horário do utilizador pode corrigir isso para exibir a data local correta.
        if (typeof dateString === 'string' && dateString.length === 10 && dateString.includes('-')) { // Assumindo YYYY-MM-DD
             const [year, month, day] = dateString.split('-').map(Number);
             adjustedDate = new Date(year, month - 1, day); // Cria a data na timezone local
        } else if (typeof dateString === 'string' && dateString.includes('T')) {
            // Para strings datetime, a conversão de new Date() geralmente lida bem.
            // No entanto, para consistência na exibição, podemos querer normalizar.
            // O ajuste de userTimezoneOffset pode ser problemático se a data original já estiver em UTC.
            // Vamos formatar com base na data como está, assumindo que a entrada é consistente.
        }


        const options = { };
        if (format.includes("dd")) options.day = '2-digit';
        if (format.includes("mmm")) options.month = 'short';
        if (format.includes("MM")) options.month = '2-digit';
        if (format.includes("yyyy")) options.year = 'numeric';
        if (format.includes("yy")) options.year = '2-digit';
        if (format.includes("HH:mm")) {
            options.hour = '2-digit';
            options.minute = '2-digit';
            options.hour12 = false; 
        }
        let locale = 'pt-BR';
        
        if (format === "mmm/yy") {
            const month = adjustedDate.toLocaleDateString(locale, { month: 'short' });
            const year = adjustedDate.toLocaleDateString(locale, { year: '2-digit' });
            return `${month.replace('.','')}/${year}`;
        }
        if (format === "yyyy-MM") { 
             const year = adjustedDate.getFullYear();
             const month = (adjustedDate.getMonth() + 1).toString().padStart(2, '0'); 
             return `${year}-${month}`;
        }
        return adjustedDate.toLocaleDateString(locale, options);
    } catch (error) {
        console.error("Error formatting date:", dateString, format, error);
        return "Data Inválida";
    }
};

const dateDiffInDays = (dateStr1, dateStr2) => {
    if (!dateStr1 || !dateStr2) return NaN;
    try {
        const d1_val = new Date(dateStr1);
        const d1 = new Date(Date.UTC(d1_val.getFullYear(), d1_val.getMonth(), d1_val.getDate()));
        
        const d2_val = new Date(dateStr2);
        const d2 = new Date(Date.UTC(d2_val.getFullYear(), d2_val.getMonth(), d2_val.getDate()));

        return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
    } catch (error) {
        return NaN;
    }
};

// --- Dados Fictícios Iniciais (Expandidos) ---
const initialColaboradores = [
    { id: 'user1', NomeCompleto: 'João Silva', EmailPrincipal: 'joao.silva@example.com', Departamento: 'Fiscal' },
    { id: 'user2', NomeCompleto: 'Maria Oliveira', EmailPrincipal: 'maria.oliveira@example.com', Departamento: 'Contabilidade' },
    { id: 'user3', NomeCompleto: 'Carlos Pereira', EmailPrincipal: 'carlos.pereira@example.com', Departamento: 'RH' },
    { id: 'user4', NomeCompleto: 'Ana Costa', EmailPrincipal: 'ana.costa@example.com', Departamento: 'Fiscal' },
    { id: 'user5', NomeCompleto: 'Lucas Mendes', EmailPrincipal: 'lucas.mendes@example.com', Departamento: 'TI' },
    { id: 'user6', NomeCompleto: 'Sofia Alves', EmailPrincipal: 'sofia.alves@example.com', Departamento: 'Jurídico' },
    { id: 'user7', NomeCompleto: 'Eneide Santos', EmailPrincipal: 'eneide.santos@example.com', Departamento: 'Fiscal'},
    { id: 'user8', NomeCompleto: 'Matheus Gomes', EmailPrincipal: 'matheus.gomes@example.com', Departamento: 'Fiscal'},
    { id: 'user9', NomeCompleto: 'Rutenberg Lima', EmailPrincipal: 'rutenberg.lima@example.com', Departamento: 'Fiscal'},
    { id: 'user10', NomeCompleto: 'Zélia Castro', EmailPrincipal: 'zelia.castro@example.com', Departamento: 'Coordenação Fiscal'},
    { id: 'user11', NomeCompleto: 'Juliana Paes', EmailPrincipal: 'juliana.paes@example.com', Departamento: 'Contabilidade'},
];

let dbObrigacoes = [
    { id: 'ob0', NomeObrigacao: 'SPED Contribuições - Matriz', Filial: '01 - Matriz CE', UF_Origem: 'CE', ColaboradorResponsavel_FK: initialColaboradores[0], Periodicidade: 'Mensal', DataReferencia: '2025-04-01', PrazoLegal: '2025-05-15', PrazoLimiteEmpresa: '2025-05-14', StatusEntrega: 'Entregue', DataEnvioEfetiva: '2025-05-10T11:00:00Z', ObservacaoMVP: 'OK', Anexos: [], Unidade: 'Fiscal', CNPJ: '11.222.333/0001-44', UF_Destino: 'N/A', Nivel: 'Federal', TempoExecucaoEstimado: '2 dias', LinkLegislacao: '#' },
    { id: 'ob-1', NomeObrigacao: 'GIA ST - SP', Filial: '02 - Filial SP', UF_Origem: 'SP', ColaboradorResponsavel_FK: initialColaboradores[3], Periodicidade: 'Mensal', DataReferencia: '2025-05-01', PrazoLegal: '2025-06-18', PrazoLimiteEmpresa: '2025-06-17', StatusEntrega: 'Entregue com Atraso', DataEnvioEfetiva: '2025-06-20T10:00:00Z', ObservacaoMVP: 'Atraso na coleta de dados.', Anexos: [], Unidade: 'Fiscal', CNPJ: '11.222.333/0003-66', UF_Destino: 'N/A', Nivel: 'Estadual', TempoExecucaoEstimado: '1 dia', LinkLegislacao: '#' },
    { id: 'ob-2', NomeObrigacao: 'EFD Reinf - Geral', Filial: 'Geral', UF_Origem: 'N/A', ColaboradorResponsavel_FK: initialColaboradores[1], Periodicidade: 'Mensal', DataReferencia: '2025-05-01', PrazoLegal: '2025-06-15', PrazoLimiteEmpresa: '2025-06-14', StatusEntrega: 'Entregue', DataEnvioEfetiva: '2025-06-10T16:00:00Z', ObservacaoMVP: 'OK', Anexos: [], Unidade: 'Contabilidade', CNPJ: '11.222.333/0001-44', UF_Destino: 'N/A', Nivel: 'Federal', TempoExecucaoEstimado: '3 dias', LinkLegislacao: '#' },
    { id: 'ob1', NomeObrigacao: 'GIA ST - CE', Filial: '01 - Matriz CE', UF_Origem: 'CE', ColaboradorResponsavel_FK: initialColaboradores[0], Periodicidade: 'Mensal', DataReferencia: '2025-07-01', PrazoLegal: '2025-08-20', PrazoLimiteEmpresa: '2025-08-19', StatusEntrega: 'Pendente', DataEnvioEfetiva: null, ObservacaoMVP: 'Verificar novas regras.', Anexos: [], Unidade: 'Fiscal', CNPJ: '11.222.333/0001-44', UF_Destino: 'N/A', Nivel: 'Estadual', TempoExecucaoEstimado: '2 dias', LinkLegislacao: 'http://example.com/gia-st-ce' },
    { id: 'ob2', NomeObrigacao: 'SPED Fiscal - PE', Filial: '05 - Filial PE', UF_Origem: 'PE', ColaboradorResponsavel_FK: initialColaboradores[1], Periodicidade: 'Mensal', DataReferencia: '2025-06-01', PrazoLegal: '2025-07-25', PrazoLimiteEmpresa: '2025-07-24', StatusEntrega: 'Entregue', DataEnvioEfetiva: '2025-07-22T10:30:00Z', ObservacaoMVP: 'OK.', Anexos: [{ nome: 'comprov_sped_pe.pdf', url: '#' }], Unidade: 'Fiscal', CNPJ: '11.222.333/0002-55', UF_Destino: 'N/A', Nivel: 'Estadual', TempoExecucaoEstimado: '3 dias', LinkLegislacao: 'http://example.com/sped-pe'},
    { id: 'ob3', NomeObrigacao: 'DCTF - Federal', Filial: 'Geral', UF_Origem: 'N/A', ColaboradorResponsavel_FK: initialColaboradores[0], Periodicidade: 'Mensal', DataReferencia: '2025-06-01', PrazoLegal: '2025-07-20', PrazoLimiteEmpresa: '2025-07-19', StatusEntrega: 'Pendente', DataEnvioEfetiva: null, ObservacaoMVP: 'Análise pendente.', Anexos: [], Unidade: 'Contabilidade', CNPJ: '11.222.333/0001-44', UF_Destino: 'N/A', Nivel: 'Federal', TempoExecucaoEstimado: '1 dia', LinkLegislacao: 'http://example.com/dctf' },
    { id: 'ob4', NomeObrigacao: 'DEFIS', Filial: 'Geral', UF_Origem: 'N/A', ColaboradorResponsavel_FK: initialColaboradores[2], Periodicidade: 'Anual', DataReferencia: '2024-12-01', PrazoLegal: '2025-03-31', PrazoLimiteEmpresa: '2025-03-30', StatusEntrega: 'Em Preparação', DataEnvioEfetiva: null, ObservacaoMVP: 'Coletando dados.', Anexos: [], Unidade: 'Contabilidade', CNPJ: '11.222.333/0001-44', UF_Destino: 'N/A', Nivel: 'Federal', TempoExecucaoEstimado: '5 dias', LinkLegislacao: 'http://example.com/defis' },
    { id: 'ob5', NomeObrigacao: 'ECF', Filial: 'Geral', UF_Origem: 'N/A', ColaboradorResponsavel_FK: initialColaboradores[1], Periodicidade: 'Anual', DataReferencia: '2024-12-01', PrazoLegal: '2025-07-31', PrazoLimiteEmpresa: '2025-07-30', StatusEntrega: 'Pendente', DataEnvioEfetiva: null, ObservacaoMVP: 'A iniciar.', Anexos: [], Unidade: 'Contabilidade', CNPJ: '11.222.333/0001-44', UF_Destino: 'N/A', Nivel: 'Federal', TempoExecucaoEstimado: '10 dias', LinkLegislacao: 'http://example.com/ecf' },
    { id: 'ob6', NomeObrigacao: 'RAIS', Filial: 'Geral', UF_Origem: 'N/A', ColaboradorResponsavel_FK: initialColaboradores[2], Periodicidade: 'Anual', DataReferencia: '2024-12-01', PrazoLegal: '2025-04-10', PrazoLimiteEmpresa: '2025-04-09', StatusEntrega: 'Entregue com Atraso', DataEnvioEfetiva: '2025-04-12T15:00:00Z', ObservacaoMVP: 'Atraso devido a sistema.', Anexos: [{nome: 'rais_comprov.pdf', url:'#'}], Unidade: 'RH', CNPJ: '11.222.333/0001-44', UF_Destino: 'N/A', Nivel: 'Federal', TempoExecucaoEstimado: '3 dias', LinkLegislacao: 'http://example.com/rais' },
];
let dbAgendaItens = [
    { id: 'ag1', Titulo: 'Reunião Pós Fechamento Fiscal JUL/25', Colaborador_FK: initialColaboradores[0], DataInicio: '2025-08-08T10:00:00', DataFim: '2025-08-08T12:00:00', DiaInteiro: false, TipoItem: 'Reunião', StatusTarefa: 'Não Iniciada', Prioridade: 'Média', Local: 'Sala A', DescricaoDetalhada: 'Discussão dos resultados e pontos de melhoria.', ProjetoVinculado_FK: null, Anexos:[] },
    { id: 'ag2', Titulo: 'Elaboração Análises Retenções JUL/25', Colaborador_FK: initialColaboradores[3], DataInicio: '2025-08-09T00:00:00', DataFim: '2025-08-09T23:59:59', DiaInteiro: true, TipoItem: 'Tarefa Individual', StatusTarefa: 'Em Andamento', Prioridade: 'Alta', Local: '', DescricaoDetalhada: 'Análise detalhada das retenções na fonte.', ProjetoVinculado_FK: null, Anexos:[] },
    { id: 'ag3', Titulo: 'Café Tributário AGO/25', Colaborador_FK: initialColaboradores[0], DataInicio: '2025-08-15T09:45:00', DataFim: '2025-08-15T11:00:00', DiaInteiro: false, TipoItem: 'Alinhamento', StatusTarefa: 'Não Iniciada', Prioridade: 'Média', Local: 'Online - Teams', DescricaoDetalhada: 'Discussão de novas legislações.', ProjetoVinculado_FK: null, Anexos:[] },
];
let dbChecklistItens = [ 
    { id: 'chk1', ID_InstanciaChecklist_FK: 'inst_fech_jul25', Sequencia: 1, Dia: '1º Dia', MesReferencia: '2025-07-01', NomeAtividade: 'Liberação de Faturamento - Saídas', Filial: 'Geral', UF: '', Analista_FK: initialColaboradores[10], Responsavel_FK: initialColaboradores[10], Executor_FK: initialColaboradores[10], StatusItem: 'Concluído', DataEntregaPlanejada: '2025-08-01', InicioCronogramaPlanejado: '2025-08-01T08:00:00', HoraInicioReal: '2025-08-01T07:52:00', HoraFimReal: '2025-08-01T08:16:00', Observacao: 'Exceto filial 54.', Anexos: [], AvaliacaoPrazo: 'Fora do Prazo', DirigiuObrigacao: 'Interna', TotalSemMovimento: 0, TempoGasto: '0:16' },
    { id: 'chk2', ID_InstanciaChecklist_FK: 'inst_fech_jul25', Sequencia: 3, Dia: '1º Dia', MesReferencia: '2025-07-01', NomeAtividade: 'Análises de Saídas e Ajustes (Após Zélia liberar o fatura)', Filial: '01', UF: 'CE', Analista_FK: initialColaboradores[3], Responsavel_FK: initialColaboradores[3], Executor_FK: initialColaboradores[3], StatusItem: 'Pendente', DataEntregaPlanejada: '2025-08-01', InicioCronogramaPlanejado: '2025-08-01T09:00:00', HoraInicioReal: null, HoraFimReal: null, Observacao: '', Anexos: [], AvaliacaoPrazo: 'Em aberto', DirigiuObrigacao: 'Interna', TotalSemMovimento: 0, TempoGasto: '' },
    { id: 'chk3', ID_InstanciaChecklist_FK: 'inst_fech_jul25', Sequencia: 3, Dia: '1º Dia', MesReferencia: '2025-07-01', NomeAtividade: 'Análises de Saídas e Ajustes (Após Zélia liberar o fatura)', Filial: '16', UF: 'CE', Analista_FK: initialColaboradores[7], Responsavel_FK: initialColaboradores[7], Executor_FK: initialColaboradores[7], StatusItem: 'Em Andamento', DataEntregaPlanejada: '2025-08-01', InicioCronogramaPlanejado: '2025-08-01T09:00:00', HoraInicioReal: '2025-08-01T08:43:00', HoraFimReal: null, Observacao: 'Analisando divergências.', Anexos: [], AvaliacaoPrazo: 'Em aberto', DirigiuObrigacao: 'Interna', TotalSemMovimento: 0, TempoGasto: '' },
];
let dbEncaminhamentos = [
    { id: 'enc1', AnalistaSolicitante_FK: initialColaboradores[6], TipoSolicitacao: 'EC 87/2015', TipoICMS: 'ICMS a recuperar', Filial: '0001', Titulo: 'Filial 01 - Pagamentos de EC 87/2015 - Venda de ativo', DataSolicitacao: '2024-02-19', PrazoResolucao: '2024-02-29', DataResolucaoEfetiva: '2024-09-24', StatusEncaminhamento: 'Baixado', ResponsavelAtual_FK: initialColaboradores[0], Observacoes: 'Protocolo SEI_GOVBA-00099118662 - Recibo Eletrônico de Protocolo', Protocolo: 'SEI_GOVBA-00099118662', Prioridade: 'Média', Anexos: [], DiasEmAtraso: 208 },
    { id: 'enc2', AnalistaSolicitante_FK: initialColaboradores[7], TipoSolicitacao: 'ICMS próprio', TipoICMS: 'Verificação de apuração', Filial: '0030', Titulo: 'Filial 0030 - Notas fiscais de entrada escrituradas com crédito a maior', DataSolicitacao: '2024-02-21', PrazoResolucao: '2024-02-29', DataResolucaoEfetiva: '2024-03-04', StatusEncaminhamento: 'Baixado', ResponsavelAtual_FK: initialColaboradores[1], Observacoes: 'Com a retificação o saldo credor foi ajustado.', Protocolo: '', Prioridade: 'Alta', Anexos: [], DiasEmAtraso: 4 },
    { id: 'enc3', AnalistaSolicitante_FK: initialColaboradores[8], TipoSolicitacao: 'DIFAL', TipoICMS: 'ICMS a recuperar', Filial: '0016', Titulo: 'Filial 16 - ICMS DIFAL a recuperar em 02.2024', DataSolicitacao: '2024-02-19', PrazoResolucao: '2024-03-04', DataResolucaoEfetiva: null, StatusEncaminhamento: 'Pendente', ResponsavelAtual_FK: initialColaboradores[3], Observacoes: 'Análise em andamento, aguardando documentos da filial.', Protocolo: '', Prioridade: 'Média', Anexos: [], DiasEmAtraso: dateDiffInDays('2024-03-04', new Date().toISOString().split('T')[0]) > 0 ? dateDiffInDays('2024-03-04', new Date().toISOString().split('T')[0]) : 0 },
];

// Simulação de API (adaptada para novos módulos)
const mockApi = { /* ... (código anterior com get/save para todos os módulos) ... */ 
    getObrigacoes: async (filtros) => { 
        await new Promise(resolve => setTimeout(resolve, 200));
        let dados = [...dbObrigacoes];
        if (filtros?.status) dados = dados.filter(o => o.StatusEntrega === filtros.status);
        if (filtros?.responsavel) dados = dados.filter(o => o.ColaboradorResponsavel_FK.NomeCompleto.toLowerCase().includes(filtros.responsavel.toLowerCase()));
        return dados.sort((a, b) => new Date(a.PrazoLimiteEmpresa).getTime() - new Date(b.PrazoLimiteEmpresa).getTime());
    },
    saveObrigacao: async (obrigacao) => { 
        await new Promise(resolve => setTimeout(resolve, 300));
        if (obrigacao.id) {
            dbObrigacoes = dbObrigacoes.map(o => o.id === obrigacao.id ? {...o, ...obrigacao} : o);
        } else {
            obrigacao.id = `ob${Date.now()}`;
            if (!obrigacao.Anexos) obrigacao.Anexos = []; 
            dbObrigacoes.push(obrigacao);
        }
        return obrigacao;
    },
    getAgendaItens: async () => { 
        await new Promise(resolve => setTimeout(resolve, 150));
        return [...dbAgendaItens].sort((a,b) => new Date(a.DataInicio).getTime() - new Date(b.DataInicio).getTime());
    },
    saveAgendaItem: async (item) => { 
         await new Promise(resolve => setTimeout(resolve, 250));
        if(item.id) {
            dbAgendaItens = dbAgendaItens.map(i => i.id === item.id ? {...i, ...item} : i);
        } else {
            item.id = `ag${Date.now()}`;
            if (!item.Anexos) item.Anexos = [];
            dbAgendaItens.push(item);
        }
        return item;
    },
    getChecklistItens: async () => { 
        await new Promise(resolve => setTimeout(resolve, 150));
        return [...dbChecklistItens].sort((a,b) => a.Sequencia - b.Sequencia);
    },
    saveChecklistItem: async (item) => {
        await new Promise(resolve => setTimeout(resolve, 250));
        if(item.id) {
            dbChecklistItens = dbChecklistItens.map(i => i.id === item.id ? {...i, ...item} : i);
        } else {
            item.id = `chk${Date.now()}`;
            if (!item.Anexos) item.Anexos = [];
            dbChecklistItens.push(item);
        }
        return item;
    },
    getEncaminhamentos: async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
        return [...dbEncaminhamentos].sort((a,b) => new Date(a.DataSolicitacao).getTime() - new Date(b.DataSolicitacao).getTime());
    },
    saveEncaminhamento: async (item) => {
        await new Promise(resolve => setTimeout(resolve, 250));
        if(item.id) {
            dbEncaminhamentos = dbEncaminhamentos.map(i => i.id === item.id ? {...i, ...item} : i);
        } else {
            item.id = `enc${Date.now()}`;
            if (!item.Anexos) item.Anexos = [];
            dbEncaminhamentos.push(item);
        }
        return item;
    }
};

// --- Componentes Reutilizáveis ---
const AppHeader = ({ currentModule }) => (
  <header className="bg-blue-700 text-white p-3 shadow-lg flex items-center justify-between sticky top-0 z-40">
    <div className="flex items-center">
      <img className="h-10 w-auto mr-3" src={LogoMdias} alt="" />
      <h1 className="text-lg sm:text-xl font-semibold">M. Dias Branco - Gestão Integrada</h1>
    </div>
    <div className="text-sm hidden sm:block">Módulo: <span className="font-bold">{currentModule}</span></div>
  </header>
);
const Sidebar = ({ onNavigate, currentModule }) => ( /* ... (código anterior com ícones) ... */ 
    <aside className="w-16 sm:w-64 bg-gray-800 text-white p-2 sm:p-4 space-y-1 sm:space-y-2 transition-all duration-200 flex-shrink-0">
        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 hidden sm:block">Módulos</h2>
        {[
            { name: 'Dashboard', id: 'dashboard', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-0 sm:mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-7a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm-1-3a1 1 0 100 2h.01a1 1 0 100-2H8zm4 0a1 1 0 100 2h.01a1 1 0 100-2H12zM8 12a1 1 0 100 2h.01a1 1 0 100-2H8zm4 0a1 1 0 100 2h.01a1 1 0 100-2H12z" /></svg> },
            { name: 'Obrigações', id: 'obrigacoes', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-0 sm:mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1V5a1 1 0 00-1-1H7zm0 4a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1v-1a1 1 0 00-1-1H7zm0 4a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1v-1a1 1 0 00-1-1H7z" clipRule="evenodd" /></svg> },
            { name: 'Agenda', id: 'agenda', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-0 sm:mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg> },
            { name: 'Checklists', id: 'checklist', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-0 sm:mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> },
            { name: 'Encaminhamentos', id: 'encaminhamentos', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-0 sm:mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13.293 7.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L14.586 11H7a1 1 0 110-2h7.586l-1.293-1.293a1 1 0 010-1.414z" /></svg> },
        ].map(mod => (
            <button key={mod.id} onClick={() => onNavigate(mod.id)} title={mod.name}
                className={`w-full flex items-center p-2 sm:p-3 rounded hover:bg-gray-700 transition-colors ${currentModule === mod.id ? 'bg-blue-600' : ''}`}>
                {mod.icon}
                <span className="hidden sm:inline ml-0 sm:ml-2">{mod.name}</span>
            </button>
        ))}
    </aside>
);

// --- Módulo: Obrigações Acessórias ---
const ObligationFilterControls = ({ statusOptions, onFilterChange, currentFilters }) => ( /* ... (código anterior) ... */ 
    <div className="p-3 sm:p-4 bg-gray-100 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <select value={currentFilters.status} onChange={(e) => onFilterChange({ ...currentFilters, status: e.target.value })}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 w-full sm:w-1/2 text-sm">
            {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <input type="text" placeholder="Pesquisar Responsável" value={currentFilters.responsavel}
            onChange={(e) => onFilterChange({ ...currentFilters, responsavel: e.target.value })}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 w-full sm:w-1/2 text-sm"/>
    </div>
);
const ObligationItemCard = ({ obrigacao, onEdit }) => ( /* ... (código anterior) ... */ 
    <div className={`p-3 rounded-lg shadow border transition-all duration-150 cursor-pointer flex flex-col justify-between ${
        obrigacao.StatusEntrega !== 'Entregue' ? 
            (dateDiffInDays(new Date().toISOString().split('T')[0], obrigacao.PrazoLimiteEmpresa) < 0 ? 'bg-red-50 hover:bg-red-100 border-red-300' : 
            dateDiffInDays(new Date().toISOString().split('T')[0], obrigacao.PrazoLimiteEmpresa) <= 7 ? 'bg-yellow-50 hover:bg-yellow-100 border-yellow-300' : 
            'bg-white hover:shadow-lg border-gray-200') : 
        'bg-green-50 hover:bg-green-100 border-green-300'
    }`} onClick={() => onEdit(obrigacao)}>
        <div>
            <div className="flex justify-between items-start mb-1">
                <h3 className="text-sm font-bold text-blue-700 truncate" title={obrigacao.NomeObrigacao}>{obrigacao.NomeObrigacao}</h3>
                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">Ref: {formatDate(obrigacao.DataReferencia, "mmm/yy")}</span>
            </div>
            <p className={`text-xs ${obrigacao.StatusEntrega !== 'Entregue' && dateDiffInDays(new Date().toISOString().split('T')[0], obrigacao.PrazoLimiteEmpresa) < 0 ? 'text-red-600 font-bold' : obrigacao.StatusEntrega !== 'Entregue' && dateDiffInDays(new Date().toISOString().split('T')[0], obrigacao.PrazoLimiteEmpresa) <= 7 ? 'text-yellow-600 font-bold' : 'text-gray-700'}`}>Prazo Emp.: {formatDate(obrigacao.PrazoLimiteEmpresa)}</p>
            <p className="text-xs text-gray-600">Status: <span className={`font-semibold ${obrigacao.StatusEntrega === 'Entregue' ? 'text-green-700' : 'text-gray-800'}`}>{obrigacao.StatusEntrega}</span></p>
            <p className="text-xs text-gray-600 truncate" title={obrigacao.ColaboradorResponsavel_FK.NomeCompleto}>Resp: {obrigacao.ColaboradorResponsavel_FK.NomeCompleto}</p>
            <p className="text-xs text-gray-500 truncate">Filial: {obrigacao.Filial}</p>
        </div>
         <button onClick={(e) => { e.stopPropagation(); onEdit(obrigacao); }}
            className="mt-2 text-xs text-blue-500 hover:text-blue-700 self-end">Ver Detalhes &rarr;</button>
    </div>
);
const ObligationListGrid = ({ obrigacoes, onEdit }) => ( /* ... (código anterior) ... */ 
    <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {obrigacoes.map(ob => <ObligationItemCard key={ob.id} obrigacao={ob} onEdit={onEdit} />)}
    </div>
);
const ObligationFormFields = ({ formData, handleChange, isSaving }) => { /* ... (código anterior) ... */ 
    const ufs = ["", "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO", "N/A"];
    const periodicidades = ["", "Mensal", "Bimestral", "Trimestral", "Semestral", "Anual", "Eventual"];
    const statusEntregaOptions = ["Pendente", "Em Preparação", "Entregue", "Entregue com Atraso"];
    const niveis = ["", "Estadual", "Federal", "Municipal"];
    const inputClass = "mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm";
    const labelClass = "block text-sm font-medium text-gray-700";

    const handleAnexoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            handleChange({ target: { name: 'Anexos', value: [...(formData.Anexos || []), { nome: file.name, url: '#', size: file.size, type: file.type }] } });
            e.target.value = null; 
        }
    };
    const removeAnexo = (nomeAnexo) => {
        handleChange({ target: { name: 'Anexos', value: formData.Anexos.filter(anexo => anexo.nome !== nomeAnexo) } });
    };

    return (
        <div className="space-y-3">
            <div><label htmlFor="NomeObrigacao" className={labelClass}>Nome da Obrigação*</label><input type="text" name="NomeObrigacao" value={formData.NomeObrigacao || ''} onChange={handleChange} className={inputClass} required disabled={isSaving} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className={labelClass}>Filial*</label><input type="text" name="Filial" value={formData.Filial || ''} onChange={handleChange} className={inputClass} required disabled={isSaving} /></div>
                <div><label className={labelClass}>Unidade</label><input type="text" name="Unidade" value={formData.Unidade || ''} onChange={handleChange} className={inputClass} disabled={isSaving} /></div>
            </div>
             <div>
                <label className={labelClass}>Colaborador Responsável*</label>
                <select name="ColaboradorResponsavel_FK_Id" value={formData.ColaboradorResponsavel_FK?.id || ''} 
                    onChange={(e) => {
                        const selectedColab = initialColaboradores.find(c => c.id === e.target.value);
                        handleChange({target: {name: 'ColaboradorResponsavel_FK', value: selectedColab || initialColaboradores[0] }});
                    }} 
                    className={inputClass} required disabled={isSaving}>
                    <option value="">Selecione...</option>
                    {initialColaboradores.map(c => <option key={c.id} value={c.id}>{c.NomeCompleto}</option>)}
                </select>
            </div>
            <div><label className={labelClass}>CNPJ</label><input type="text" name="CNPJ" value={formData.CNPJ || ''} onChange={handleChange} className={inputClass} disabled={isSaving} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className={labelClass}>UF Origem*</label><select name="UF_Origem" value={formData.UF_Origem || ''} onChange={handleChange} className={inputClass} required disabled={isSaving}>{ufs.map(uf => <option key={uf} value={uf}>{uf}</option>)}</select></div>
                <div><label className={labelClass}>UF Destino</label><select name="UF_Destino" value={formData.UF_Destino || 'N/A'} onChange={handleChange} className={inputClass} disabled={isSaving}>{ufs.map(uf => <option key={uf} value={uf}>{uf}</option>)}</select></div>
            </div>
            <div><label className={labelClass}>Nível</label><select name="Nivel" value={formData.Nivel || ''} onChange={handleChange} className={inputClass} disabled={isSaving}>{niveis.map(n => <option key={n} value={n}>{n}</option>)}</select></div>
            <div><label className={labelClass}>Descrição/Observação</label><textarea name="DescricaoObservacao" value={formData.DescricaoObservacao || ''} onChange={handleChange} rows="2" className={inputClass} disabled={isSaving}></textarea></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className={labelClass}>Tempo Execução Estimado</label><input type="text" name="TempoExecucaoEstimado" value={formData.TempoExecucaoEstimado || ''} onChange={handleChange} className={inputClass} disabled={isSaving} /></div>
                <div><label className={labelClass}>Periodicidade*</label><select name="Periodicidade" value={formData.Periodicidade || ''} onChange={handleChange} className={inputClass} required disabled={isSaving}>{periodicidades.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div><label className={labelClass}>Data Referência*</label><input type="date" name="DataReferencia" value={formData.DataReferencia ? formData.DataReferencia.split('T')[0] : ''} onChange={handleChange} className={inputClass} required disabled={isSaving} /></div>
                <div><label className={labelClass}>Prazo Legal*</label><input type="date" name="PrazoLegal" value={formData.PrazoLegal ? formData.PrazoLegal.split('T')[0] : ''} onChange={handleChange} className={inputClass} required disabled={isSaving} /></div>
                <div><label className={labelClass}>Prazo Limite Empresa*</label><input type="date" name="PrazoLimiteEmpresa" value={formData.PrazoLimiteEmpresa ? formData.PrazoLimiteEmpresa.split('T')[0] : ''} onChange={handleChange} className={inputClass} required disabled={isSaving} /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className={labelClass}>Status Entrega*</label><select name="StatusEntrega" value={formData.StatusEntrega || ''} onChange={handleChange} className={inputClass} required disabled={isSaving}>{statusEntregaOptions.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                <div><label className={labelClass}>Data Envio Efetiva</label><input type="datetime-local" name="DataEnvioEfetiva" value={formData.DataEnvioEfetiva ? formData.DataEnvioEfetiva.substring(0,16) : ''} onChange={handleChange} className={inputClass} disabled={isSaving} /></div>
            </div>
            <div><label className={labelClass}>Link Legislação</label><input type="url" name="LinkLegislacao" value={formData.LinkLegislacao || ''} onChange={handleChange} className={inputClass} disabled={isSaving} placeholder="http://example.com" /></div>
            <div><label className={labelClass}>Observação MVP</label><textarea name="ObservacaoMVP" value={formData.ObservacaoMVP || ''} onChange={handleChange} rows="2" className={inputClass} disabled={isSaving}></textarea></div>
            <div>
                <label className={labelClass}>Anexo Comprovante</label>
                <input type="file" onChange={handleAnexoChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" disabled={isSaving}/>
                {formData.Anexos && formData.Anexos.length > 0 && (
                    <ul className="mt-2 list-disc list-inside text-sm">
                        {formData.Anexos.map((anexo, index) => (
                            <li key={index} className="text-gray-600 flex justify-between items-center">
                                <span>{anexo.nome} ({anexo.size ? (anexo.size / 1024).toFixed(1) + ' KB' : ''})</span>
                                <button type="button" onClick={() => removeAnexo(anexo.nome)} className="ml-2 text-red-500 hover:text-red-700 text-xs" disabled={isSaving}>(Remover)</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
const GenericFormModal = ({ isOpen, onClose, onSave, title, initialData = {}, formFieldsComponent: FormFieldsComponent }) => { 
    const [formData, setFormData] = useState(initialData);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || {}); 
        }
    }, [initialData, isOpen]);

    const handleChange = (e_or_fieldUpdate) => {
        if (e_or_fieldUpdate && e_or_fieldUpdate.target) {
            const { name, value, type, checked } = e_or_fieldUpdate.target;
            if (name && name.endsWith('_Id')) { 
                const fieldToUpdate = name.substring(0, name.length - 3); 
                const selectedColab = initialColaboradores.find(c => c.id === value);
                setFormData(prev => ({ ...prev, [fieldToUpdate]: selectedColab || prev[fieldToUpdate] }));
            } else if (type === 'checkbox') {
                setFormData(prev => ({ ...prev, [name]: checked }));
            } else {
                setFormData(prev => ({ ...prev, [name]: value }));
            }
        } else { 
             setFormData(prev => ({ ...prev, ...e_or_fieldUpdate }));
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const dataToSave = { ...formData };
        
        ['DataReferencia', 'PrazoLegal', 'PrazoLimiteEmpresa', 'DataSolicitacao', 'PrazoResolucao', 'DataResolucaoEfetiva', 'DataEntregaPlanejada', 'MesReferencia'].forEach(field => {
            if (dataToSave[field] && typeof dataToSave[field] === 'string' && dataToSave[field].match(/^\d{4}-\d{2}-\d{2}$/)) {
                // Data YYYY-MM-DD: OK
            } else if (dataToSave[field] && typeof dataToSave[field] === 'string' && dataToSave[field].match(/^\d{4}-\d{2}$/)) { // Mês YYYY-MM
                dataToSave[field] = `${dataToSave[field]}-01`; // Adiciona dia 01 para ser data válida
            }
            else if (dataToSave[field] && dataToSave[field].includes && dataToSave[field].includes('T')) { 
                 // Input tipo datetime-local (YYYY-MM-DDTHH:MM), convertendo para data YYYY-MM-DD (pega só a data)
                 try { dataToSave[field] = new Date(dataToSave[field]).toISOString().split('T')[0]; }
                 catch(er) { console.warn(`Erro ao converter data ${field} (datetime-local): ${dataToSave[field]}`)}
            } else if (dataToSave[field]) { // Outros formatos de data (ex: objeto Date)
                 try {
                    let dateObj = new Date(dataToSave[field]);
                    // Correção para inputs de data que podem vir com timezone errada
                    if (typeof dataToSave[field] === 'string' && dataToSave[field].length === 10 && dataToSave[field].includes('-')) {
                        const [year, month, day] = dataToSave[field].split('-').map(Number);
                        dateObj = new Date(Date.UTC(year, month - 1, day));
                    }
                    dataToSave[field] = dateObj.toISOString().split('T')[0]; 
                 } catch(e){ console.error(`Erro ao converter data ${field}: ${dataToSave[field]}`)}
            }
        });
        
        ['DataEnvioEfetiva', 'DataInicio', 'DataFim', 'HoraInicioReal', 'HoraFimReal', 'InicioCronogramaPlanejado'].forEach(field => {
             if (dataToSave[field] && dataToSave[field].length >= 16) { // datetime-local (YYYY-MM-DDTHH:MM) ou ISO
                 try {
                    if(!dataToSave[field].endsWith('Z')){ // Se não for ISO com Z, converte
                        dataToSave[field] = new Date(dataToSave[field]).toISOString();
                    }
                 } catch (err) { console.error("Erro ao converter data-hora: ", field, dataToSave[field])}
             }
        });
        await onSave(dataToSave);
        setIsSaving(false);
        onClose(); 
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-lg sm:max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl p-1">&times;</button>
                </div>
                <form onSubmit={handleSubmit} id={`modalForm-${title.replace(/\s+/g, '-')}`} className="space-y-3 sm:space-y-4 overflow-y-auto pr-1 sm:pr-2 flex-grow">
                    <FormFieldsComponent formData={formData} handleChange={handleChange} isSaving={isSaving} />
                </form>
                 <div className="flex justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t mt-3 sm:mt-4 flex-shrink-0">
                    <button type="button" onClick={onClose} className="py-2 px-3 sm:px-4 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50" disabled={isSaving}>
                        Cancelar
                    </button>
                    <button type="submit" form={`modalForm-${title.replace(/\s+/g, '-')}`} className="py-2 px-3 sm:px-4 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50" disabled={isSaving}>
                        {isSaving ? 'A Guardar...' : 'Guardar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Módulos ---
const ObrigacoesScreen = ({ onEdit, onAdd, allObrigacoes }) => { /* ... (código anterior) ... */ 
    const [filteredObrigacoes, setFilteredObrigacoes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({ status: '', responsavel: '' });
    const statusOptions = [ 
        { value: '', label: 'Todos os Status' }, { value: 'Pendente', label: 'Pendente' },
        { value: 'Em Preparação', label: 'Em Preparação' }, { value: 'Entregue', label: 'Entregue' },
        { value: 'Entregue com Atraso', label: 'Entregue com Atraso' },
    ];
    
    useEffect(() => {
        setIsLoading(true);
        let dados = [...allObrigacoes];
        if (filters.status) dados = dados.filter(o => o.StatusEntrega === filters.status);
        if (filters.responsavel) dados = dados.filter(o => o.ColaboradorResponsavel_FK.NomeCompleto.toLowerCase().includes(filters.responsavel.toLowerCase()));
        setFilteredObrigacoes(dados.sort((a, b) => new Date(a.PrazoLimiteEmpresa).getTime() - new Date(b.PrazoLimiteEmpresa).getTime()));
        setIsLoading(false);
    }, [filters, allObrigacoes]);

    return (
        <div className="h-full flex flex-col">
            <div className="p-3 sm:p-4 border-b flex justify-between items-center bg-white sticky top-0 z-30">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Painel de Obrigações</h2>
                <button onClick={onAdd} className="bg-blue-600 text-white py-2 px-3 sm:px-4 rounded-md hover:bg-blue-700 transition flex items-center text-xs sm:text-sm">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    Nova
                </button>
            </div>
            <ObligationFilterControls statusOptions={statusOptions} onFilterChange={setFilters} currentFilters={filters} />
            {isLoading ? <p className="p-4 text-center text-gray-600">A carregar...</p> : <ObligationListGrid obrigacoes={filteredObrigacoes} onEdit={onEdit} />}
        </div>
    );
};
const AgendaItemFormFields = ({ formData, handleChange, isSaving }) => ( /* ... (código anterior) ... */ 
    <div className="space-y-3">
        <div><label htmlFor="Titulo" className="block text-sm font-medium text-gray-700">Título*</label><input type="text" name="Titulo" value={formData.Titulo || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm" required disabled={isSaving}/></div>
        <div>
            <label htmlFor="Colaborador_FK_Id" className="block text-sm font-medium text-gray-700">Colaborador*</label>
            <select name="Colaborador_FK_Id" value={formData.Colaborador_FK?.id || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm" required disabled={isSaving}>
                <option value="">Selecione...</option>
                {initialColaboradores.map(c => <option key={c.id} value={c.id}>{c.NomeCompleto}</option>)}
            </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div><label htmlFor="DataInicio" className="block text-sm font-medium text-gray-700">Data Início*</label><input type="datetime-local" name="DataInicio" value={formData.DataInicio ? formData.DataInicio.substring(0,16) : ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm" required disabled={isSaving}/></div>
            <div><label htmlFor="DataFim" className="block text-sm font-medium text-gray-700">Data Fim*</label><input type="datetime-local" name="DataFim" value={formData.DataFim ? formData.DataFim.substring(0,16) : ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm" required disabled={isSaving}/></div>
        </div>
        <div className="flex items-center mt-2">
            <input type="checkbox" name="DiaInteiro" id="DiaInteiro" checked={formData.DiaInteiro || false} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" disabled={isSaving}/>
            <label htmlFor="DiaInteiro" className="ml-2 block text-sm text-gray-900">Dia Inteiro</label>
        </div>
        <div><label htmlFor="TipoItem" className="block text-sm font-medium text-gray-700">Tipo*</label><select name="TipoItem" value={formData.TipoItem || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm" required disabled={isSaving}>{["", "Reunião", "Tarefa Individual", "Bloco de Trabalho", "Feriado", "Alinhamento", "Capacitação", "Outro"].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
        <div><label htmlFor="StatusTarefa" className="block text-sm font-medium text-gray-700">Status Tarefa</label><select name="StatusTarefa" value={formData.StatusTarefa || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm" disabled={isSaving}>{["", "Não Iniciada", "Em Andamento", "Concluída", "Bloqueada", "Cancelada"].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
         <div><label className="block text-sm font-medium text-gray-700">Prioridade</label><select name="Prioridade" value={formData.Prioridade || 'Média'} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm" disabled={isSaving}>{["", "Baixa", "Média", "Alta"].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
        <div><label htmlFor="Local" className="block text-sm font-medium text-gray-700">Local</label><input type="text" name="Local" value={formData.Local || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm" disabled={isSaving}/></div>
        <div><label htmlFor="DescricaoDetalhada" className="block text-sm font-medium text-gray-700">Descrição</label><textarea name="DescricaoDetalhada" value={formData.DescricaoDetalhada || ''} onChange={handleChange} rows="3" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm" disabled={isSaving}></textarea></div>
        {/* Adicionar campo para Anexos se necessário para Agenda */}
    </div>
);
const AgendaScreen = ({ onEdit, onAdd, allAgendaItens }) => ( /* ... (código anterior) ... */ 
    <div className="h-full flex flex-col">
        <div className="p-3 sm:p-4 border-b flex justify-between items-center bg-white sticky top-0 z-30">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Agenda de Trabalho</h2>
            <button onClick={onAdd} className="bg-blue-600 text-white py-2 px-3 sm:px-4 rounded-md hover:bg-blue-700 transition flex items-center text-xs sm:text-sm">Adicionar Evento</button>
        </div>
        {allAgendaItens.length === 0 && !onEdit /* Hackish way to check if loading vs empty */ ? <p className="p-4 text-center text-gray-600">A carregar agenda...</p> : (
            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 overflow-y-auto">
                {allAgendaItens.length === 0 && <p className="text-gray-500">Nenhum item na agenda.</p>}
                {allAgendaItens.map(item => (
                    <div key={item.id} className={`bg-white p-3 rounded-md shadow border-l-4 ${item.TipoItem === 'Reunião' ? 'border-blue-500' : item.TipoItem === 'Tarefa Individual' ? 'border-green-500' : 'border-gray-300'} cursor-pointer hover:shadow-md transition-shadow`} onClick={() => onEdit(item)}>
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-blue-700 text-sm sm:text-base">{item.Titulo}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${item.StatusTarefa === 'Concluída' ? 'bg-green-100 text-green-700' : item.StatusTarefa === 'Em Andamento' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{item.StatusTarefa}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600">
                            {item.DiaInteiro ? `Dia Inteiro - ${formatDate(item.DataInicio, "dd/MM/yy")}` : `De: ${formatDate(item.DataInicio, "dd/MM/yy HH:mm")} Até: ${formatDate(item.DataFim, "dd/MM/yy HH:mm")}`}
                        </p>
                        <p className="text-xs text-gray-500 truncate">Resp: {item.Colaborador_FK.NomeCompleto} | Local: {item.Local || 'N/A'}</p>
                         {item.DescricaoDetalhada && <p className="text-xs text-gray-500 mt-1 truncate">Obs: {item.DescricaoDetalhada}</p>}
                    </div>
                ))}
            </div>
        )}
    </div>
);

// --- Módulo: Checklist de Fechamento ---
const ChecklistItemFormFields = ({ formData, handleChange, isSaving }) => { /* ... (código anterior) ... */ 
    const labelClass = "block text-sm font-medium text-gray-700";
    const inputClass = "mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm";
    const statusChecklistOptions = ["Pendente", "Em Andamento", "Concluído", "OK", "Bloqueado", "Não Aplicável"];
    const avaliacaoPrazoOptions = ["Em aberto", "No Prazo", "Fora do Prazo", "Interna - No Prazo", "Interna - Fora do Prazo", "OK"];

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className={labelClass}>Mês Referência (YYYY-MM)</label><input type="month" name="MesReferencia" value={formData.MesReferencia ? formData.MesReferencia.substring(0,7) : ''} onChange={handleChange} className={inputClass} disabled={isSaving}/></div>
                 <div><label className={labelClass}>Dia (Ex: 1º Dia)</label><input type="text" name="Dia" value={formData.Dia || ''} onChange={handleChange} className={inputClass} disabled={isSaving}/></div>
            </div>
            <div><label className={labelClass}>Nome da Atividade*</label><input type="text" name="NomeAtividade" value={formData.NomeAtividade || ''} onChange={handleChange} className={inputClass} required disabled={isSaving}/></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className={labelClass}>Filial</label><input type="text" name="Filial" value={formData.Filial || ''} onChange={handleChange} className={inputClass} disabled={isSaving}/></div>
                <div><label className={labelClass}>UF</label><input type="text" name="UF" value={formData.UF || ''} onChange={handleChange} className={inputClass} disabled={isSaving}/></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div><label className={labelClass}>Analista</label><select name="Analista_FK_Id" value={formData.Analista_FK?.id || ''} onChange={handleChange} className={inputClass} disabled={isSaving}><option value="">Selecione...</option>{initialColaboradores.map(c=><option key={c.id} value={c.id}>{c.NomeCompleto}</option>)}</select></div>
                <div><label className={labelClass}>Responsável</label><select name="Responsavel_FK_Chk_Id" value={formData.Responsavel_FK?.id || ''} onChange={handleChange} className={inputClass} disabled={isSaving}><option value="">Selecione...</option>{initialColaboradores.map(c=><option key={c.id} value={c.id}>{c.NomeCompleto}</option>)}</select></div>
                <div><label className={labelClass}>Executor</label><select name="Executor_FK_Id" value={formData.Executor_FK?.id || ''} onChange={handleChange} className={inputClass} disabled={isSaving}><option value="">Selecione...</option>{initialColaboradores.map(c=><option key={c.id} value={c.id}>{c.NomeCompleto}</option>)}</select></div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div><label className={labelClass}>Início Cronograma</label><input type="datetime-local" name="InicioCronogramaPlanejado" value={formData.InicioCronogramaPlanejado ? formData.InicioCronogramaPlanejado.substring(0,16) : ''} onChange={handleChange} className={inputClass} disabled={isSaving}/></div>
                <div><label className={labelClass}>Data Entrega Planejada</label><input type="date" name="DataEntregaPlanejada" value={formData.DataEntregaPlanejada ? formData.DataEntregaPlanejada.split('T')[0] : ''} onChange={handleChange} className={inputClass} disabled={isSaving}/></div>
                <div><label className={labelClass}>Total Sem Movimento</label><input type="number" name="TotalSemMovimento" value={formData.TotalSemMovimento || ''} onChange={handleChange} className={inputClass} disabled={isSaving}/></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className={labelClass}>Hora Início Real</label><input type="datetime-local" name="HoraInicioReal" value={formData.HoraInicioReal ? formData.HoraInicioReal.substring(0,16) : ''} onChange={handleChange} className={inputClass} disabled={isSaving}/></div>
                <div><label className={labelClass}>Hora Fim Real</label><input type="datetime-local" name="HoraFimReal" value={formData.HoraFimReal ? formData.HoraFimReal.substring(0,16) : ''} onChange={handleChange} className={inputClass} disabled={isSaving}/></div>
            </div>
             <div><label className={labelClass}>Tempo Gasto (Ex: 0:25)</label><input type="text" name="TempoGasto" value={formData.TempoGasto || ''} onChange={handleChange} className={inputClass} disabled={isSaving}/></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className={labelClass}>Status Item*</label><select name="StatusItem" value={formData.StatusItem || ''} onChange={handleChange} className={inputClass} required disabled={isSaving}>{statusChecklistOptions.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
                <div><label className={labelClass}>Avaliação Prazo</label><select name="AvaliacaoPrazo" value={formData.AvaliacaoPrazo || ''} onChange={handleChange} className={inputClass} disabled={isSaving}>{avaliacaoPrazoOptions.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
            </div>
            <div><label className={labelClass}>Dirigiu Obrigação (Ex: Interna)</label><input type="text" name="DirigiuObrigacao" value={formData.DirigiuObrigacao || ''} onChange={handleChange} className={inputClass} disabled={isSaving}/></div>
            <div><label className={labelClass}>Observação</label><textarea name="Observacao" value={formData.Observacao || ''} onChange={handleChange} rows="3" className={inputClass} disabled={isSaving}></textarea></div>
        </div>
    );
};
const ChecklistScreen = ({ onEdit, onAdd, allChecklistItens }) => { /* ... (código anterior) ... */ 
    const [isLoading, setIsLoading] = useState(true);
    // Adicionar filtros para Checklist se necessário
     useEffect(()=>{ if(allChecklistItens) setIsLoading(false);}, [allChecklistItens]);

    return ( <div className="h-full flex flex-col">
            <div className="p-3 sm:p-4 border-b flex justify-between items-center bg-white sticky top-0 z-30">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Checklist de Fechamento</h2>
                <button onClick={onAdd} className="bg-blue-600 text-white py-2 px-3 sm:px-4 rounded-md hover:bg-blue-700 transition flex items-center text-xs sm:text-sm">Novo Item</button>
            </div>
            {isLoading ? <p className="p-4 text-center text-gray-600">A carregar checklist...</p> : (
                <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 overflow-y-auto">
                    {allChecklistItens.length === 0 && <p className="text-gray-500">Nenhum item de checklist.</p>}
                    {allChecklistItens.map(item => (
                        <div key={item.id} className={`bg-white p-3 rounded-md shadow border-l-4 ${item.StatusItem === 'Concluído' || item.StatusItem === 'OK' ? 'border-green-500' : item.StatusItem === 'Pendente' ? 'border-yellow-500' : item.StatusItem === 'Em Andamento' ? 'border-blue-400' : 'border-red-500'} cursor-pointer hover:shadow-md`} onClick={() => onEdit(item)}>
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-blue-700 text-sm sm:text-base truncate" title={item.NomeAtividade}>{item.Sequencia}. {item.Dia} - {item.NomeAtividade} (Filial: {item.Filial || 'Geral'})</h3>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">{item.StatusItem}</span>
                            </div>
                            <p className="text-xs text-gray-600">Resp: {item.Responsavel_FK?.NomeCompleto || 'N/A'} | Executor: {item.Executor_FK?.NomeCompleto || 'N/A'}</p>
                            <p className="text-xs text-gray-500">Prazo Planejado: {formatDate(item.DataEntregaPlanejada)} | Início Real: {item.HoraInicioReal ? formatDate(item.HoraInicioReal, "dd/MM HH:mm") : "N/A"}</p>
                            {item.Observacao && <p className="text-xs text-gray-500 mt-1 italic">Obs: {item.Observacao}</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Módulo: Encaminhamentos Internos ---
const EncaminhamentoFormFields = ({ formData, handleChange, isSaving }) => { /* ... (código anterior) ... */ 
    const labelClass = "block text-sm font-medium text-gray-700";
    const inputClass = "mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-sm";
    const statusEncOptions = ["Pendente ID Fornecedor", "Concluído", "Em Andamento", "Cancelado", "Resolvido", "Aguardando verificação", "Aguardando avaliação", "Pendente", "Baixado"];
    const prioridadeOptions = ["Baixa", "Média", "Alta"];

    return (
        <div className="space-y-3">
            <div><label className={labelClass}>Título/Assunto E-mail*</label><input type="text" name="Titulo" value={formData.Titulo || ''} onChange={handleChange} className={inputClass} required disabled={isSaving}/></div>
            <div><label className={labelClass}>Analista Solicitante*</label><select name="AnalistaSolicitante_FK_Id" value={formData.AnalistaSolicitante_FK?.id || ''} onChange={handleChange} className={inputClass} required disabled={isSaving}><option value="">Selecione...</option>{initialColaboradores.map(c=><option key={c.id} value={c.id}>{c.NomeCompleto}</option>)}</select></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 <div><label className={labelClass}>Tipo Solicitação</label><input type="text" name="TipoSolicitacao" value={formData.TipoSolicitacao || ''} onChange={handleChange} className={inputClass} disabled={isSaving}/></div>
                 <div><label className={labelClass}>Tipo ICMS (se aplicável)</label><input type="text" name="TipoICMS" value={formData.TipoICMS || ''} onChange={handleChange} className={inputClass} disabled={isSaving}/></div>
            </div>
            <div><label className={labelClass}>Filial</label><input type="text" name="Filial" value={formData.Filial || ''} onChange={handleChange} className={inputClass} disabled={isSaving}/></div>
            <div><label className={labelClass}>Descrição da Solicitação</label><textarea name="DescricaoSolicitacao" value={formData.DescricaoSolicitacao || ''} onChange={handleChange} rows="3" className={inputClass} disabled={isSaving}></textarea></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className={labelClass}>Data Solicitação*</label><input type="date" name="DataSolicitacao" value={formData.DataSolicitacao ? formData.DataSolicitacao.split('T')[0] : ''} onChange={handleChange} className={inputClass} required disabled={isSaving}/></div>
                <div><label className={labelClass}>Prazo para Resolução</label><input type="date" name="PrazoResolucao" value={formData.PrazoResolucao ? formData.PrazoResolucao.split('T')[0] : ''} onChange={handleChange} className={inputClass} disabled={isSaving}/></div>
            </div>
            <div><label className={labelClass}>Data Resolução Efetiva</label><input type="date" name="DataResolucaoEfetiva" value={formData.DataResolucaoEfetiva ? formData.DataResolucaoEfetiva.split('T')[0] : ''} onChange={handleChange} className={inputClass} disabled={isSaving}/></div>
            <div><label className={labelClass}>Responsável Atual</label><select name="ResponsavelAtual_FK_Id" value={formData.ResponsavelAtual_FK?.id || ''} onChange={handleChange} className={inputClass} disabled={isSaving}><option value="">Selecione...</option>{initialColaboradores.map(c=><option key={c.id} value={c.id}>{c.NomeCompleto}</option>)}</select></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className={labelClass}>Status*</label><select name="StatusEncaminhamento" value={formData.StatusEncaminhamento || ''} onChange={handleChange} className={inputClass} required disabled={isSaving}>{statusEncOptions.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
                <div><label className={labelClass}>Prioridade</label><select name="Prioridade" value={formData.Prioridade || 'Média'} onChange={handleChange} className={inputClass} disabled={isSaving}>{prioridadeOptions.map(p=><option key={p} value={p}>{p}</option>)}</select></div>
            </div>
            <div><label className={labelClass}>Protocolo</label><input type="text" name="Protocolo" value={formData.Protocolo || ''} onChange={handleChange} className={inputClass} disabled={isSaving}/></div>
            <div><label className={labelClass}>Observações</label><textarea name="Observacoes" value={formData.Observacoes || ''} onChange={handleChange} rows="3" className={inputClass} disabled={isSaving}></textarea></div>
             {formData.id && formData.DiasEmAtraso !== undefined && <div><label className={labelClass}>Dias em Atraso (Calculado)</label><input type="text" value={formData.DiasEmAtraso} className={inputClass} disabled /></div>}
        </div>
    );
};
const EncaminhamentosScreen = ({ onEdit, onAdd, allEncaminhamentos }) => { /* ... (código anterior) ... */ 
    const [isLoading, setIsLoading] = useState(true);
    // Adicionar filtros para Encaminhamentos aqui se necessário
    useEffect(()=>{ if(allEncaminhamentos) setIsLoading(false);}, [allEncaminhamentos]);

    return ( <div className="h-full flex flex-col">
            <div className="p-3 sm:p-4 border-b flex justify-between items-center bg-white sticky top-0 z-30">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Encaminhamentos Internos</h2>
                <button onClick={onAdd} className="bg-blue-600 text-white py-2 px-3 sm:px-4 rounded-md hover:bg-blue-700 transition flex items-center text-xs sm:text-sm">Novo Encaminhamento</button>
            </div>
            {isLoading ? <p className="p-4 text-center text-gray-600">A carregar encaminhamentos...</p> : (
                <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 overflow-y-auto">
                    {allEncaminhamentos.length === 0 && <p className="text-gray-500">Nenhum encaminhamento.</p>}
                    {allEncaminhamentos.map(item => (
                        <div key={item.id} className={`bg-white p-3 rounded-md shadow border-l-4 ${item.Prioridade === 'Alta' ? 'border-red-500' : item.Prioridade === 'Média' ? 'border-yellow-500' : 'border-gray-300'} cursor-pointer hover:shadow-md`} onClick={() => onEdit(item)}>
                             <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-blue-700 text-sm sm:text-base truncate" title={item.Titulo}>{item.Titulo} (Filial: {item.Filial})</h3>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${item.StatusEncaminhamento === 'Baixado' || item.StatusEncaminhamento === 'Concluído' || item.StatusEncaminhamento === 'Resolvido' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.StatusEncaminhamento}</span>
                            </div>
                            <p className="text-xs text-gray-600">Solic.: {item.AnalistaSolicitante_FK?.NomeCompleto || 'N/A'} | Resp. Atual: {item.ResponsavelAtual_FK?.NomeCompleto || 'N/A'}</p>
                            <p className="text-xs text-gray-500">Data Solic.: {formatDate(item.DataSolicitacao)} | Prazo: {formatDate(item.PrazoResolucao)} {item.DiasEmAtraso > 0 && <span className="text-red-500 font-semibold">({item.DiasEmAtraso} dias atraso)</span>}</p>
                            {item.Observacoes && <p className="text-xs text-gray-500 mt-1 italic truncate">Obs: {item.Observacoes}</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const KpiCard = ({ title, value, subtext, icon, colorClass = "text-blue-500", bgColorClass = "bg-blue-100" }) => {
    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg flex items-center space-x-4">
            {icon && <div className={`${colorClass} p-3 ${bgColorClass} rounded-full`}>{icon}</div>}
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{value}</p>
                {subtext && <p className="text-xs text-gray-400">{subtext}</p>}
            </div>
        </div>
    );
};

const DashboardScreen = ({ allObrigacoes }) => {
    const [kpis, setKpis] = useState({ total: 0, pendentes: 0, noPrazo: 0, comAtraso: 0, conformidade: "0%"});
    const [obrigaCoesCriticas, setObrigaCoesCriticas] = useState([]);
    const [statusDistribution, setStatusDistribution] = useState({});
    const [tendenciaEntregas, setTendenciaEntregas] = useState([]);

    useEffect(() => {
        if (allObrigacoes && allObrigacoes.length > 0) {
            const total = allObrigacoes.length;
            const hoje = new Date();
            const hojeUTC = new Date(Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()));

            const pendentesList = allObrigacoes.filter(o => o.StatusEntrega !== 'Entregue');
            const pendentes = pendentesList.length;
            
            const entreguesList = allObrigacoes.filter(o => o.StatusEntrega === 'Entregue');
            const noPrazo = entreguesList.filter(o => {
                if (!o.DataEnvioEfetiva || !o.PrazoLimiteEmpresa) return false;
                const dataEnvio = new Date(o.DataEnvioEfetiva.split('T')[0] + 'T00:00:00Z'); // Comparar apenas data
                const prazoLimite = new Date(o.PrazoLimiteEmpresa.split('T')[0] + 'T00:00:00Z'); // Comparar apenas data
                return dataEnvio <= prazoLimite;
            }).length;
            
            const comAtrasoList = allObrigacoes.filter(o => 
                o.StatusEntrega === 'Entregue com Atraso' || 
                (o.StatusEntrega !== 'Entregue' && o.PrazoLimiteEmpresa && new Date(o.PrazoLimiteEmpresa) < hojeUTC)
            );
            const comAtraso = comAtrasoList.length;

            const conformidade = entreguesList.length > 0 ? ((noPrazo / entreguesList.length) * 100).toFixed(1) + "%" : "N/A";
            
            setKpis({ total, pendentes, noPrazo, comAtraso, conformidade });

            const criticas = pendentesList
                .filter(o => o.PrazoLimiteEmpresa && new Date(o.PrazoLimiteEmpresa) >= hojeUTC) 
                .sort((a,b) => new Date(a.PrazoLimiteEmpresa).getTime() - new Date(b.PrazoLimiteEmpresa).getTime())
                .slice(0, 5);
            setObrigaCoesCriticas(criticas);

            const dist = allObrigacoes.reduce((acc, o) => {
                acc[o.StatusEntrega] = (acc[o.StatusEntrega] || 0) + 1;
                return acc;
            }, {});
            setStatusDistribution(dist);

            const entregasPorMes = allObrigacoes.reduce((acc, o) => {
                if (!o.DataReferencia) return acc;
                const mesRef = formatDate(o.DataReferencia, "yyyy-MM");
                if (!acc[mesRef]) {
                    acc[mesRef] = { mes: formatDate(o.DataReferencia, "mmm/yy"), entreguesNoPrazo: 0, entreguesComAtraso: 0, pendentesNaoEntreguesAposPrazo:0 };
                }
                if (o.StatusEntrega === 'Entregue' && o.DataEnvioEfetiva && new Date(o.DataEnvioEfetiva) <= new Date(o.PrazoLimiteEmpresa)) {
                    acc[mesRef].entreguesNoPrazo++;
                } else if (o.StatusEntrega === 'Entregue com Atraso' || (o.StatusEntrega === 'Entregue' && o.DataEnvioEfetiva && new Date(o.DataEnvioEfetiva) > new Date(o.PrazoLimiteEmpresa))) {
                    acc[mesRef].entreguesComAtraso++;
                } else if (o.StatusEntrega !== 'Entregue' && o.PrazoLimiteEmpresa && new Date(o.PrazoLimiteEmpresa) < hojeUTC) {
                    acc[mesRef].pendentesNaoEntreguesAposPrazo++;
                }
                return acc;
            }, {});
            setTendenciaEntregas(Object.values(entregasPorMes).sort((a,b)=> {
                // Ordenar por data mmm/yy
                const [m1Str, y1Str] = a.mes.split('/');
                const [m2Str, y2Str] = b.mes.split('/');
                const monthMap = {"jan":0, "fev":1, "mar":2, "abr":3, "mai":4, "jun":5, "jul":6, "ago":7, "set":8, "out":9, "nov":10, "dez":11};
                const date1 = new Date(parseInt("20"+y1Str), monthMap[m1Str.toLowerCase()]);
                const date2 = new Date(parseInt("20"+y2Str), monthMap[m2Str.toLowerCase()]);
                return date1 - date2;
            }));
        } else {
             setKpis({ total: 0, pendentes: 0, noPrazo: 0, comAtraso: 0, conformidade: "0%"});
             setObrigaCoesCriticas([]);
             setStatusDistribution({});
             setTendenciaEntregas([]);
        }
    }, [allObrigacoes]);

    return (
        <div className="p-3 sm:p-6 bg-gray-50 flex-1 overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 sm:mb-6">Dashboard Estratégico - Obrigações</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <KpiCard title="Total" value={kpis.total} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />
                <KpiCard title="Pendentes" value={kpis.pendentes} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} colorClass="text-yellow-500" bgColorClass="bg-yellow-100" />
                <KpiCard title="No Prazo" value={kpis.noPrazo} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} colorClass="text-green-500" bgColorClass="bg-green-100" />
                <KpiCard title="Com Atraso / Risco" value={kpis.comAtraso} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} colorClass="text-red-500" bgColorClass="bg-red-100" />
                <KpiCard title="Conformidade" value={kpis.conformidade} subtext="Entregues No Prazo / Total Entregues" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>} colorClass="text-indigo-500" bgColorClass="bg-indigo-100"/>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="lg:col-span-1 bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                    <h3 className="text-md sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Distribuição de Status</h3>
                    {Object.keys(statusDistribution).length > 0 && kpis.total > 0 ? (
                        <div className="space-y-2">
                            {Object.entries(statusDistribution).map(([status, count]) => (
                                <div key={status}>
                                    <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
                                        <span>{status}</span>
                                        <span>{count} ({((count/kpis.total)*100).toFixed(1)}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4"><div className={`${status === 'Entregue' ? 'bg-green-500' : status === 'Pendente' ? 'bg-yellow-500' : status === 'Em Preparação' ? 'bg-blue-500' : 'bg-red-500'} h-3 sm:h-4 rounded-full`} style={{ width: `${(count/kpis.total)*100}%`}}></div></div>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-sm text-gray-500">Sem dados para exibir.</p>}
                </div>
                <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                    <h3 className="text-md sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Tendência de Entregas Mensais</h3>
                     {tendenciaEntregas.length > 0 ? (
                        <div className="h-48 sm:h-64 relative">
                           <div className="flex justify-around items-end h-full border-b border-gray-300 pb-2">
                                {tendenciaEntregas.map((item, index) => {
                                    const totalNoMes = item.entreguesNoPrazo + item.entreguesComAtraso + item.pendentesNaoEntreguesAposPrazo;
                                    const alturaMaxima = 150; //px
                                    return(
                                    <div key={index} className="text-center text-xs w-1/4 sm:w-1/6" title={`Mês: ${item.mes}\nNo Prazo: ${item.entreguesNoPrazo}\nCom Atraso: ${item.entreguesComAtraso}\nNão Entregue (Atrasado): ${item.pendentesNaoEntreguesAposPrazo}`}>
                                        <div className="flex flex-col-reverse items-center h-full">
                                            {item.pendentesNaoEntreguesAposPrazo > 0 && <div className="bg-gray-400 w-4 sm:w-6" style={{height: `${totalNoMes > 0 ? (item.pendentesNaoEntreguesAposPrazo/totalNoMes)*alturaMaxima : 0}px`}} title={`Não Entregue (Vencido): ${item.pendentesNaoEntreguesAposPrazo}`}></div>}
                                            {item.entreguesComAtraso > 0 && <div className="bg-red-500 w-4 sm:w-6" style={{height: `${totalNoMes > 0 ? (item.entreguesComAtraso/totalNoMes)*alturaMaxima : 0}px`}} title={`Com Atraso: ${item.entreguesComAtraso}`}></div>}
                                            {item.entreguesNoPrazo > 0 && <div className="bg-green-500 w-4 sm:w-6" style={{height: `${totalNoMes > 0 ? (item.entreguesNoPrazo/totalNoMes)*alturaMaxima : 0}px`}} title={`No Prazo: ${item.entreguesNoPrazo}`}></div>}
                                        </div>
                                        <span className="mt-1 block">{item.mes}</span>
                                    </div>
                                )})}
                           </div>
                            <div className="flex justify-center space-x-4 mt-2 text-xs"><span className="flex items-center"><div className="w-3 h-3 bg-green-500 mr-1 rounded-sm"></div>No Prazo</span><span className="flex items-center"><div className="w-3 h-3 bg-red-500 mr-1 rounded-sm"></div>Com Atraso</span><span className="flex items-center"><div className="w-3 h-3 bg-gray-400 mr-1 rounded-sm"></div>Não Entregue (Vencido)</span></div>
                        </div>
                    ) : <p className="text-sm text-gray-500">Sem dados de tendência.</p>}
                </div>
                 <div className="lg:col-span-3 bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                    <h3 className="text-md sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Obrigações Críticas (Pendentes, Próximas do Prazo)</h3>
                    {obrigaCoesCriticas.length > 0 ? (
                        <ul className="space-y-2 sm:space-y-3 max-h-60 overflow-y-auto">
                            {obrigaCoesCriticas.map(ob => (
                                <li key={ob.id} className="text-xs sm:text-sm p-2 border-l-4 border-orange-500 bg-orange-50 rounded-r-md flex justify-between items-center">
                                    <div><p className="font-medium text-orange-700">{ob.NomeObrigacao} ({ob.Filial})</p><p className="text-gray-600">Prazo: {formatDate(ob.PrazoLimiteEmpresa)} - Resp: {ob.ColaboradorResponsavel_FK.NomeCompleto}</p></div>
                                    <span className="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full">{dateDiffInDays(new Date().toISOString().split('T')[0], ob.PrazoLimiteEmpresa) === 0 ? "Hoje!" : `${dateDiffInDays(new Date().toISOString().split('T')[0], ob.PrazoLimiteEmpresa)} dia(s)`}</span>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-sm text-gray-500">Nenhuma obrigação crítica.</p>}
                </div>
            </div>
        </div>
    );
};

// --- Componente Principal da Aplicação ---
function App() { /* ... (código anterior, com a lógica de fetchAllData e save para os novos módulos) ... */ 
    const [currentModuleId, setCurrentModuleId] = useState('dashboard');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formModuleType, setFormModuleType] = useState(''); 

    const [allObrigacoes, setAllObrigacoes] = useState([]);
    const [allAgendaItens, setAllAgendaItens] = useState([]);
    const [allChecklistItens, setAllChecklistItens] = useState([]);
    const [allEncaminhamentos, setAllEncaminhamentos] = useState([]);


    const moduleTitles = {
        dashboard: 'Dashboard Estratégico',
        obrigacoes: 'Obrigações Acessórias',
        agenda: 'Agenda de Trabalho',
        checklist: 'Checklist de Fechamento',
        encaminhamentos: 'Encaminhamentos Internos',
    };

    const fetchAllData = useCallback(async () => {
        const obrigData = await mockApi.getObrigacoes({});
        setAllObrigacoes(obrigData);
        const agendaData = await mockApi.getAgendaItens({});
        setAllAgendaItens(agendaData);
        const checklistData = await mockApi.getChecklistItens({});
        setAllChecklistItens(checklistData);
        const encaminhamentosData = await mockApi.getEncaminhamentos({});
        setAllEncaminhamentos(encaminhamentosData);
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);


    const handleNavigate = (moduleId) => {
        setCurrentModuleId(moduleId);
        setIsFormModalOpen(false); 
    };

    const handleAddItem = (moduleType) => {
        setEditingItem(null); // Garante que é um novo item
        setFormModuleType(moduleType);
        setIsFormModalOpen(true);
    };

    const handleEditItem = (item, moduleType) => {
        setEditingItem(item);
        setFormModuleType(moduleType);
        setIsFormModalOpen(true);
    };

    const handleSaveItem = async (itemData) => {
        if (formModuleType === 'obrigacao') {
            await mockApi.saveObrigacao(itemData);
        } else if (formModuleType === 'agendaItem') {
            await mockApi.saveAgendaItem(itemData);
        } else if (formModuleType === 'checklistItem') {
            await mockApi.saveChecklistItem(itemData);
        } else if (formModuleType === 'encaminhamento') {
            await mockApi.saveEncaminhamento(itemData);
        }
        fetchAllData(); 
    };
    
    const renderCurrentModule = () => {
        switch (currentModuleId) {
            case 'dashboard':
                return <DashboardScreen allObrigacoes={allObrigacoes} />;
            case 'obrigacoes':
                return <ObrigacoesScreen onEdit={(item) => handleEditItem(item, 'obrigacao')} onAdd={() => handleAddItem('obrigacao')} allObrigacoes={allObrigacoes} />;
            case 'agenda':
                return <AgendaScreen onEdit={(item) => handleEditItem(item, 'agendaItem')} onAdd={() => handleAddItem('agendaItem')} allAgendaItens={allAgendaItens} />;
            case 'checklist': 
                return <ChecklistScreen onEdit={(item) => handleEditItem(item, 'checklistItem')} onAdd={() => handleAddItem('checklistItem')} allChecklistItens={allChecklistItens} />;
            case 'encaminhamentos':
                return <EncaminhamentosScreen onEdit={(item) => handleEditItem(item, 'encaminhamento')} onAdd={() => handleAddItem('encaminhamento')} allEncaminhamentos={allEncaminhamentos} />;
            default:
                return <div className="p-4 text-gray-600">Selecione um módulo na barra lateral.</div>;
        }
    };

    const getFormFieldsComponent = () => {
        if(formModuleType === 'obrigacao') return ObligationFormFields;
        if(formModuleType === 'agendaItem') return AgendaItemFormFields;
        if(formModuleType === 'checklistItem') return ChecklistItemFormFields;
        if(formModuleType === 'encaminhamento') return EncaminhamentoFormFields;
        return () => <p className="text-red-500">Configuração de formulário ausente para {formModuleType}.</p>;
    };
    
    const getFormInitialData = () => {
        if (editingItem) { 
            const data = {...editingItem};
            // Tratamento para campos lookup/FK para garantir que o objeto completo está lá
            ['ColaboradorResponsavel_FK', 'Colaborador_FK', 'AnalistaSolicitante_FK', 'ResponsavelAtual_FK', 'Analista_FK', 'Responsavel_FK', 'Executor_FK'].forEach(fkField => {
                 if (data[fkField] && typeof data[fkField] === 'string') { // Se for apenas ID, busca o objeto
                    data[fkField] = initialColaboradores.find(c => c.id === data[fkField]) || (initialColaboradores.length > 0 ? initialColaboradores[0] : {});
                } else if (data[fkField] && typeof data[fkField] === 'object' && !data[fkField].id && initialColaboradores.length > 0) { // Se for objeto mas sem id (improvável, mas para segurança)
                    data[fkField] = initialColaboradores[0] || {};
                } else if (!data[fkField] && initialColaboradores.length > 0 && (fkField === 'ColaboradorResponsavel_FK' || fkField === 'Colaborador_FK' || fkField === 'AnalistaSolicitante_FK' || fkField === 'ResponsavelAtual_FK' || fkField === 'Analista_FK' || fkField === 'Responsavel_FK' || fkField === 'Executor_FK')) { 
                    // Define um default apenas para campos FK se estiverem vazios e for um novo item.
                    // data[fkField] = initialColaboradores[0] || {}; 
                }
            });
            return data;
        }
        // Valores padrão para novos itens
        if (formModuleType === 'obrigacao') return { StatusEntrega: 'Pendente', UF_Origem: 'CE', Periodicidade: 'Mensal', Anexos:[], ColaboradorResponsavel_FK: initialColaboradores[0] || {} };
        if (formModuleType === 'agendaItem') return { DiaInteiro: false, TipoItem: 'Reunião', StatusTarefa: 'Não Iniciada', Prioridade: 'Média', Colaborador_FK: initialColaboradores[0] || {}};
        if (formModuleType === 'checklistItem') return { StatusItem: 'Pendente', Analista_FK: initialColaboradores[0] || {}, Responsavel_FK: initialColaboradores[0] || {}, Executor_FK: initialColaboradores[0] || {} };
        if (formModuleType === 'encaminhamento') return { StatusEncaminhamento: 'Pendente', Prioridade: 'Média', AnalistaSolicitante_FK: initialColaboradores[0] || {}, ResponsavelAtual_FK: initialColaboradores[0] || {} };
        return {};
    };

    return (
        <div className="h-screen flex flex-col antialiased text-gray-900 bg-gray-100">
            <AppHeader currentModule={moduleTitles[currentModuleId] || 'Visão Geral'} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar onNavigate={handleNavigate} currentModule={currentModuleId} />
                <main className="flex-1 overflow-y-auto">
                    {renderCurrentModule()}
                </main>
            </div>
            <GenericFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSave={handleSaveItem}
                title={editingItem ? `Editar ${moduleTitles[formModuleType] || 'Item'}` : `Novo ${moduleTitles[formModuleType] || 'Item'}`}
                initialData={getFormInitialData()}
                formFieldsComponent={getFormFieldsComponent()}
            />
        </div>
    );
}

export default App;

