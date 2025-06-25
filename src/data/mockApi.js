/**
 * Arquivo: mockApi.js
 * Descrição: Este arquivo simula operações de API para o Gestor Integrado Inteligente (GII),
 * fornecendo dados mockados para colaboradores, categorias e atividades.
 * Ele serve como uma camada temporária que será substituída por uma integração
 * com o Firestore (ou Dataverse) no futuro.
 */

// Array de colaboradores mockados.
// Em uma aplicação real com Firestore, estes seriam documentos em uma coleção 'users' ou 'colaboradores'.
export const initialColaboradores = [
    { id: 'user1', NomeCompleto: 'João Silva', EmailPrincipal: 'joao.silva@example.com', Departamento: 'Fiscal' },
    { id: 'user2', NomeCompleto: 'Maria Oliveira', EmailPrincipal: 'maria.oliveira@example.com', Departamento: 'Contabilidade' },
    { id: 'user3', NomeCompleto: 'Carlos Pereira', EmailPrincipal: 'carlos.pereira@example.com', Departamento: 'RH' },
    { id: 'user4', NomeCompleto: 'Ana Costa', EmailPrincipal: 'ana.costa@example.com', Departamento: 'Fiscal' },
    { id: 'user5', NomeCompleto: 'Lucas Mendes', EmailPrincipal: 'lucas.mendes@example.com', Departamento: 'TI' },
    { id: 'user6', NomeCompleto: 'Sofia Alves', EmailPrincipal: 'sofia.alves@example.com', Departamento: 'Jurídico' },
    { id: 'user7', NomeCompleto: 'Eneide Santos', EmailPrincipal: 'eneide.santos@example.com', Departamento: 'Fiscal' },
    { id: 'user8', NomeCompleto: 'Matheus Gomes', EmailPrincipal: 'matheus.gomes@example.com', Departamento: 'Fiscal' },
    { id: 'user9', NomeCompleto: 'Rutenberg Lima', EmailPrincipal: 'rutenberg.lima@example.com', Departamento: 'Fiscal' },
    { id: 'user10', NomeCompleto: 'Zélia Castro', EmailPrincipal: 'zelia.castro@example.com', Departamento: 'Coordenação Fiscal' },
    { id: 'user11', NomeCompleto: 'Juliana Paes', EmailPrincipal: 'juliana.paes@example.com', Departamento: 'Contabilidade' }
];

// Array de categorias mockadas.
// Em uma aplicação real com Firestore, seriam documentos em uma coleção 'categorias'.
// As subcategorias seriam um array de strings dentro do documento da categoria.
let dbCategorias = [
    { id: 'cat1', nome: 'Obrigações', subcategorias: ['GIA ST', 'SPED Fiscal', 'SPED Contribuições', 'DCTF', 'DEFIS', 'ECF', 'RAIS', 'Outra Obrigação'] },
    { id: 'cat2', nome: 'Agenda', subcategorias: ['Reunião Interna', 'Reunião Externa', 'Fechamento', 'Alinhamento', 'Capacitação', 'Evento', 'Feriado'] },
    { id: 'cat3', nome: 'Pagamento', subcategorias: ['Impostos Federais', 'Impostos Estaduais', 'Fornecedores', 'Taxas'] },
    { id: 'cat4', nome: 'Encaminhamento', subcategorias: ['Verificação de Apuração', 'Solicitação de Crédito', 'Ajuste Contábil', 'Suporte TI'] },
    { id: 'cat5', nome: 'Atividade Extra', subcategorias: ['Projeto Interno', 'Relatório Ad-hoc', 'Análise de Viabilidade', 'Outra Atividade'] },
    { id: 'cat6', nome: 'Checklist', subcategorias: ['Item de Fechamento Fiscal', 'Item de Fechamento Contábil', 'Onboarding RH'] }
];

// Array de atividades mockadas.
// Em uma aplicação real com Firestore, seriam documentos em uma coleção 'atividades'.
// Note que 'responsavel_FK' é um objeto completo aqui, simulando uma referência.
// No Firestore, seria um DocumentReference ou apenas o ID do usuário.
let dbAtividades = [
    { id: 'atv1', titulo: 'GIA ST - CE (Jul/25)', responsavel_FK: initialColaboradores[0], status: 'Pendente', categoria: 'Obrigações', subcategoria: 'GIA ST', PrazoLimiteEmpresa: '2025-08-19', DataReferencia: '2025-07-01', descricao: 'Entrega da Guia de Informação e Apuração do ICMS-ST para o estado do Ceará referente a Julho de 2025.', Prioridade: 'Alta' },
    { id: 'atv2', titulo: 'SPED Fiscal - PE (Jun/25)', responsavel_FK: initialColaboradores[1], status: 'Concluído', categoria: 'Obrigações', subcategoria: 'SPED Fiscal', PrazoLimiteEmpresa: '2025-07-24', DataReferencia: '2025-06-01', DataConclusao: '2025-07-22T10:30:00Z', descricao: 'Envio do SPED Fiscal de Pernambuco referente ao mês de Junho. Conferência final realizada.', Prioridade: 'Média' },
    { id: 'atv3', titulo: 'RAIS (Ano 2024)', responsavel_FK: initialColaboradores[2], status: 'Concluído em atraso', categoria: 'Obrigações', subcategoria: 'RAIS', PrazoLimiteEmpresa: '2025-04-09', DataReferencia: '2024-12-01', DataConclusao: '2025-04-12T15:00:00Z', descricao: 'Relatório Anual de Informações Sociais de 2024. Houve atraso devido a inconsistências de dados.', Prioridade: 'Alta' },
    { id: 'atv4', titulo: 'Reunião de Alinhamento Fiscal', responsavel_FK: initialColaboradores[9], status: 'Em andamento', categoria: 'Agenda', subcategoria: 'Alinhamento', DataInicio: '2025-07-10T14:00:00Z', DataFim: '2025-07-10T15:00:00Z', descricao: 'Reunião semanal com a equipe fiscal para alinhamento de projetos e pendências.', Prioridade: 'Baixa' },
    { id: 'atv5', titulo: 'Pagamento GPS - Jun/25', responsavel_FK: initialColaboradores[7], status: 'Pendente', categoria: 'Pagamento', subcategoria: 'Impostos Federais', PrazoLimiteEmpresa: '2025-07-20', DataReferencia: '2025-06-01', descricao: 'Pagamento da Guia da Previdência Social referente a Junho. Aguardando aprovação.', Prioridade: 'Média' },
    { id: 'atv6', titulo: 'Verificação de Apuração ICMS', responsavel_FK: initialColaboradores[3], Solicitante_FK: initialColaboradores[0], status: 'Em aberto', categoria: 'Encaminhamento', subcategoria: 'Verificação de Apuração', descricao: 'Solicitação para verificar a apuração do ICMS de Maio/25 antes do envio.', Prioridade: 'Alta' },
    { id: 'atv7', titulo: 'Configuração de VPN', responsavel_FK: initialColaboradores[4], Solicitante_FK: initialColaboradores[1], status: 'Pendente', categoria: 'Encaminhamento', subcategoria: 'Suporte TI', descricao: 'Solicitação de TI para configuração de acesso VPN para novo colaborador.', Prioridade: 'Média' },
    { id: 'atv8', titulo: 'Fechamento Contábil - Jul/25', responsavel_FK: initialColaboradores[10], status: 'Em andamento', categoria: 'Agenda', subcategoria: 'Fechamento', DataInicio: '2025-07-25T09:00:00Z', DataFim: '2025-07-30T18:00:00Z', descricao: 'Processo de fechamento contábil mensal.', Prioridade: 'Alta' },
    { id: 'atv9', titulo: 'Ajuste Contábil - Despesas', responsavel_FK: initialColaboradores[10], Solicitante_FK: initialColaboradores[6], status: 'Em aberto', categoria: 'Encaminhamento', subcategoria: 'Ajuste Contábil', descricao: 'Solicitação de ajuste para despesas de viagem.', Prioridade: 'Baixa' },
    { id: 'atv10', titulo: 'Pesquisa sobre Crédito de PIS/COFINS', responsavel_FK: initialColaboradores[8], status: 'Em andamento', categoria: 'Atividade Extra', subcategoria: 'Análise de Viabilidade', descricao: 'Análise de novas possibilidades de crédito de PIS/COFINS para a empresa.', Prioridade: 'Média' },
];

/**
 * Objeto mockApi: Simula as chamadas de API para o frontend.
 */
export const mockApi = {
    /**
     * Simula a busca de atividades com filtros e ordenação.
     * @param {Object} filtros - Objeto contendo filtros como status, responsável e categoria.
     * @returns {Promise<Array<Object>>} Uma promessa que resolve para um array de atividades filtradas e ordenadas.
     */
    getAtividades: async (filtros) => {
        // Simula um atraso de rede
        await new Promise(resolve => setTimeout(resolve, 200));

        let dados = [...dbAtividades]; // Cria uma cópia para não modificar o array original

        // Aplica filtros se eles existirem
        if (filtros?.status) {
            dados = dados.filter(o => o.status === filtros.status);
        }
        if (filtros?.responsavel) {
            // Filtra por ID do responsável
            dados = dados.filter(o => o.responsavel_FK?.id === filtros.responsavel);
        }
        if (filtros?.categoria) {
            dados = dados.filter(o => o.categoria === filtros.categoria);
        }
        if (filtros?.search) {
            dados = dados.filter(o =>
                o.titulo?.toLowerCase().includes(filtros.search.toLowerCase()) ||
                o.descricao?.toLowerCase().includes(filtros.search.toLowerCase())
            );
        }

        // Ordena as atividades pela data de prazo ou referência
        // Nota: Em um ambiente real com Firestore, a ordenação e filtragem seriam
        // otimizadas pelo próprio banco de dados, evitando carregar e processar tudo no cliente.
        return dados.sort((a, b) => {
            const dateA = a.PrazoLimiteEmpresa || a.DataFim || a.DataInicio;
            const dateB = b.PrazoLimiteEmpresa || b.DataFim || b.DataInicio;

            // Tratamento para datas nulas ou inválidas, colocando-as no final
            if (!dateA && !dateB) return 0;
            if (!dateA) return 1;
            if (!dateB) return -1;

            return new Date(dateA).getTime() - new Date(dateB).getTime();
        });
    },

    /**
     * Simula o salvamento (criação ou atualização) de uma atividade.
     * @param {Object} atividade - O objeto de atividade a ser salvo.
     * @returns {Promise<Object>} Uma promessa que resolve para o objeto de atividade salvo.
     */
    saveAtividade: async (atividade) => {
        await new Promise(resolve => setTimeout(resolve, 300));

        // Clona a atividade para evitar mutações diretas
        const atividadeToSave = { ...atividade };

        if (atividadeToSave.id) {
            // Atualiza uma atividade existente
            dbAtividades = dbAtividades.map(o => o.id === atividadeToSave.id ? atividadeToSave : o);
        } else {
            // Cria uma nova atividade com um ID único baseado no timestamp
            atividadeToSave.id = `atv${Date.now()}`;
            dbAtividades.push(atividadeToSave);
        }
        console.log("Atividade salva:", atividadeToSave); // Para depuração
        return atividadeToSave;
    },

    /**
     * Simula a exclusão de uma atividade pelo ID.
     * @param {string} id - O ID da atividade a ser excluída.
     * @returns {Promise<boolean>} Uma promessa que resolve para true se a atividade foi encontrada e excluída.
     */
    deleteAtividade: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 200)); // Simula atraso
        const initialLength = dbAtividades.length;
        dbAtividades = dbAtividades.filter(atv => atv.id !== id);
        console.log(`Atividade com ID ${id} excluída.`);
        return dbAtividades.length < initialLength; // Retorna true se algo foi removido
    },

    /**
     * Simula a busca de categorias.
     * @returns {Promise<Array<Object>>} Uma promessa que resolve para um array de categorias.
     */
    getCategorias: async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return [...dbCategorias]; // Retorna uma cópia
    },

    /**
     * Simula o salvamento (criação ou atualização) de uma categoria.
     * @param {Object} categoria - O objeto de categoria a ser salvo.
     * @returns {Promise<Object>} Uma promessa que resolve para o objeto de categoria salvo.
     */
    saveCategoria: async (categoria) => {
        await new Promise(resolve => setTimeout(resolve, 200));

        const categoriaToSave = { ...categoria };

        if (categoriaToSave.id) {
            // Atualiza uma categoria existente
            dbCategorias = dbCategorias.map(c => c.id === categoriaToSave.id ? categoriaToSave : c);
        } else {
            // Cria uma nova categoria com um ID único
            categoriaToSave.id = `cat${Date.now()}`;
            dbCategorias.push(categoriaToSave);
        }
        console.log("Categoria salva:", categoriaToSave); // Para depuração
        return categoriaToSave;
    },

    /**
     * Simula a autenticação de login.
     * @param {string} email - O email ou usuário para login.
     * @param {string} password - A senha.
     * @returns {Promise<Object>} Uma promessa que resolve para um objeto de sucesso ou rejeita com erro.
     */
    login: async (email, password) => {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simula atraso de rede para login
        // Credenciais mockadas para demonstração
        if (email === 'admin@mdias.com' && password === 'admin123') {
            return { success: true, user: { id: 'mockUser1', name: 'Admin GII', email: email } };
        } else {
            throw new Error('Invalid credentials'); // Simula falha de login
        }
    },

    /**
     * Simula o logout.
     * @returns {Promise<Object>} Uma promessa que resolve para um objeto de sucesso.
     */
    logout: async () => {
        await new Promise(resolve => setTimeout(resolve, 100)); // Simula atraso de rede
        console.log('User logged out.');
        return { success: true };
    }
};
