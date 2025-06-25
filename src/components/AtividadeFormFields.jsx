import React from 'react';
// Importações de ícones Lucide React via React Icons para elementos do formulário
import { LuBookOpen, LuCalendarCheck, LuClipboardList, LuUser, LuTag, LuMapPin, LuDollarSign, LuFileText } from 'react-icons/lu';

/**
 * AtividadeFormFields Component
 * Renderiza os campos do formulário para criação ou edição de atividades.
 * Os campos exibidos dependem da categoria selecionada.
 *
 * @param {Object} props - As propriedades do componente.
 * @param {Object} props.formData - Os dados atuais do formulário.
 * @param {function} props.handleChange - Função de callback para atualizar o estado do formulário.
 * @param {boolean} props.isSaving - Indica se o formulário está em processo de salvamento (para desabilitar campos).
 * @param {Array<Object>} props.categorias - Lista de objetos de categoria, contendo nome e subcategorias.
 * @param {Array<Object>} props.colaboradores - Lista de objetos de colaboradores (responsáveis).
 */
export const AtividadeFormFields = ({
    formData,
    handleChange,
    isSaving,
    categorias,
    colaboradores,
}) => {
    // Classes Tailwind para rótulos e inputs, centralizadas para consistência
    const labelClass = "block text-sm font-semibold text-gray-700 mb-1";
    const inputClass =
        "mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 placeholder-gray-400 text-sm appearance-none leading-tight transition duration-150 ease-in-out";

    // Opções de status padronizadas
    const statusOptions = [
        "Em aberto",
        "Em andamento",
        "Pendente",
        "Concluído",
        "Concluído em atraso",
        "Aprovado", // Adicionado status para fluxo de aprovação
        "Rejeitado", // Adicionado status para fluxo de aprovação
    ];

    // Lista de UFs (Estados) brasileiros
    const ufs = [
        "", "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
        "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO", "N/A",
    ];

    // Encontra a categoria selecionada para determinar subcategorias
    const selectedCategoriaObj = categorias.find(
        (c) => c.nome === formData.categoria
    );
    const subcategorias = selectedCategoriaObj
        ? selectedCategoriaObj.subcategorias
        : [];

    return (
        // Contêiner principal do formulário com espaçamento consistente
        <div className="space-y-5 px-1 pb-2"> {/* Aumentado o espaçamento entre as seções */}
            {/* Campo: Título da Atividade */}
            <div>
                <label htmlFor="titulo" className={labelClass}>
                    Título da Atividade <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        type="text"
                        id="titulo" // Adicionado ID para acessibilidade
                        name="titulo"
                        value={formData.titulo || ""}
                        onChange={handleChange}
                        className={`${inputClass} pl-10`} // Ajuste para o ícone
                        required
                        disabled={isSaving}
                        placeholder="Ex: Entrega da DIRF 2024" // Placeholder útil
                    />
                    <LuClipboardList className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /> {/* Ícone */}
                </div>
            </div>

            {/* Campos: Categoria e Subcategoria (layout em grid responsivo) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Aumentado o gap */}
                <div>
                    <label htmlFor="categoria" className={labelClass}>
                        Categoria <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            id="categoria" // Adicionado ID
                            name="categoria"
                            value={formData.categoria || ""}
                            onChange={handleChange}
                            className={`${inputClass} pl-10`} // Ajuste para o ícone
                            required
                            disabled={isSaving}
                        >
                            <option value="">Selecione...</option>
                            {categorias.map((c) => (
                                <option key={c.id || c.nome} value={c.nome}> {/* Melhorado a key para ser mais robusta */}
                                    {c.nome}
                                </option>
                            ))}
                        </select>
                        <LuTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /> {/* Ícone */}
                    </div>
                </div>
                <div>
                    <label htmlFor="subcategoria" className={labelClass}>
                        Subcategoria
                    </label>
                    <div className="relative">
                        <select
                            id="subcategoria" // Adicionado ID
                            name="subcategoria"
                            value={formData.subcategoria || ""}
                            onChange={handleChange}
                            className={`${inputClass} pl-10`} // Ajuste para o ícone
                            disabled={isSaving || subcategorias.length === 0} // Desabilita se não houver subcategorias
                        >
                            <option value="">Selecione...</option>
                            {subcategorias.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                        <LuTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /> {/* Ícone */}
                    </div>
                </div>
            </div>

            {/* Campo: Responsável */}
            <div>
                <label htmlFor="responsavel_FK_Id" className={labelClass}>
                    Responsável <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <select
                        id="responsavel_FK_Id" // Adicionado ID
                        name="responsavel_FK_Id" // Nome corrigido para match com o valor do option
                        value={formData.responsavel_FK?.id || ""}
                        onChange={(e) => {
                            // Lógica para atualizar corretamente o objeto responsavel_FK
                            const selectedId = e.target.value;
                            const selectedColaborador = colaboradores.find(c => c.id === selectedId);
                            handleChange({
                                target: {
                                    name: "responsavel_FK",
                                    value: selectedColaborador ? { id: selectedColaborador.id, NomeCompleto: selectedColaborador.NomeCompleto } : null,
                                },
                            });
                        }}
                        className={`${inputClass} pl-10`} // Ajuste para o ícone
                        required
                        disabled={isSaving}
                    >
                        <option value="">Selecione...</option>
                        {colaboradores && colaboradores.length > 0 ? (
                            colaboradores.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.NomeCompleto}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>Carregando colaboradores...</option>
                        )}
                    </select>
                    <LuUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /> {/* Ícone */}
                </div>
            </div>

            {/* Campo: Status */}
            <div>
                <label htmlFor="status" className={labelClass}>
                    Status <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <select
                        id="status" // Adicionado ID
                        name="status"
                        value={formData.status || ""}
                        onChange={handleChange}
                        className={`${inputClass} pl-10`} // Ajuste para o ícone
                        required
                        disabled={isSaving}
                    >
                        {statusOptions.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                    <LuBookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /> {/* Ícone */}
                </div>
            </div>

            {/* Seção Condicional: Detalhes da Obrigação (se categoria for "Obrigações") */}
            {formData.categoria === "Obrigações" && (
                <div className="p-4 border border-blue-300 bg-blue-50 rounded-xl space-y-4 shadow-sm"> {/* Estilização aprimorada */}
                    <h4 className="font-headline font-bold text-blue-800 text-lg flex items-center gap-2">
                        <LuFileText className="text-blue-600" /> Detalhes da Obrigação
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Aumentado o gap */}
                        <div>
                            <label htmlFor="cnpj" className={labelClass}>CNPJ</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="cnpj"
                                    name="CNPJ"
                                    value={formData.CNPJ || ""}
                                    onChange={handleChange}
                                    className={`${inputClass} pl-10`}
                                    disabled={isSaving}
                                    placeholder="00.000.000/0000-00"
                                />
                                <LuFileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="ie" className={labelClass}>Inscrição Estadual (IE)</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="ie"
                                    name="IE"
                                    value={formData.IE || ""}
                                    onChange={handleChange}
                                    className={`${inputClass} pl-10`}
                                    disabled={isSaving}
                                    placeholder="Ex: 123.456.789"
                                />
                                <LuFileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* Aumentado o gap */}
                        <div>
                            <label htmlFor="uf" className={labelClass}>UF<span className="text-red-500">*</span></label>
                            <div className="relative">
                                <select
                                    id="uf"
                                    name="UF"
                                    value={formData.UF || ""}
                                    onChange={handleChange}
                                    className={`${inputClass} pl-10`}
                                    required
                                    disabled={isSaving}
                                >
                                    {ufs.map((uf) => (
                                        <option key={uf} value={uf}>
                                            {uf}
                                        </option>
                                    ))}
                                </select>
                                <LuMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="prazoLegal" className={labelClass}>Prazo Legal<span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input
                                    type="date"
                                    id="prazoLegal"
                                    name="PrazoLegal"
                                    value={
                                        formData.PrazoLegal ? formData.PrazoLegal.split("T")[0] : ""
                                    }
                                    onChange={handleChange}
                                    className={`${inputClass} pl-10`}
                                    required
                                    disabled={isSaving}
                                />
                                <LuCalendarCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="prazoLimiteEmpresa" className={labelClass}>Prazo Limite Empresa<span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input
                                    type="date"
                                    id="prazoLimiteEmpresa"
                                    name="PrazoLimiteEmpresa"
                                    value={
                                        formData.PrazoLimiteEmpresa
                                            ? formData.PrazoLimiteEmpresa.split("T")[0]
                                            : ""
                                    }
                                    onChange={handleChange}
                                    className={`${inputClass} pl-10`}
                                    required
                                    disabled={isSaving}
                                />
                                <LuCalendarCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="dataReferencia" className={labelClass}>Data Referência</label>
                        <div className="relative">
                            <input
                                type="date"
                                id="dataReferencia"
                                name="DataReferencia"
                                value={
                                    formData.DataReferencia
                                        ? formData.DataReferencia.split("T")[0]
                                        : ""
                                }
                                onChange={handleChange}
                                className={`${inputClass} pl-10`}
                                disabled={isSaving}
                            />
                            <LuCalendarCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                </div>
            )}

            {/* Seção Condicional: Detalhes da Agenda (se categoria for "Agenda") */}
            {formData.categoria === "Agenda" && (
                <div className="p-4 border border-green-300 bg-green-50 rounded-xl space-y-4 shadow-sm"> {/* Estilização aprimorada */}
                    <h4 className="font-headline font-bold text-green-800 text-lg flex items-center gap-2">
                        <LuCalendarCheck className="text-green-600" /> Detalhes da Agenda
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Aumentado o gap */}
                        <div>
                            <label htmlFor="dataInicio" className={labelClass}>Data Início<span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input
                                    type="datetime-local"
                                    id="dataInicio"
                                    name="DataInicio"
                                    value={
                                        formData.DataInicio
                                            ? new Date(formData.DataInicio).toISOString().slice(0, 16)
                                            : ""
                                    }
                                    onChange={handleChange}
                                    className={`${inputClass} pl-10`}
                                    required
                                    disabled={isSaving}
                                />
                                <LuCalendarCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="dataFim" className={labelClass}>Data Fim<span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input
                                    type="datetime-local"
                                    id="dataFim"
                                    name="DataFim"
                                    value={
                                        formData.DataFim ? new Date(formData.DataFim).toISOString().slice(0, 16) : ""
                                    }
                                    onChange={handleChange}
                                    className={`${inputClass} pl-10`}
                                    required
                                    disabled={isSaving}
                                />
                                <LuCalendarCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Campo: Descrição / Detalhes */}
            <div>
                <label htmlFor="descricao" className={labelClass}>Descrição / Detalhes</label>
                <div className="relative">
                    <textarea
                        id="descricao"
                        name="descricao"
                        value={formData.descricao || ""}
                        onChange={handleChange}
                        rows="4" // Aumentado o número de linhas padrão
                        className={`${inputClass} pl-10 resize-y`} // Adicionado resize vertical
                        disabled={isSaving}
                        placeholder="Adicione detalhes importantes sobre a atividade..."
                    ></textarea>
                    <LuBookOpen className="absolute left-3 top-3 text-gray-400" /> {/* Ícone posicionado no topo */}
                </div>
            </div>
        </div>
    );
};
