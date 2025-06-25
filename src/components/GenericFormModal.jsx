import React, { useState, useEffect } from 'react';
// Importando o Dialog Component do Radix UI para acessibilidade e comportamento de modal robusto
import * as Dialog from '@radix-ui/react-dialog';
// Importando ícone de fechar do Lucide React via React Icons
import { LuX, LuSave } from 'react-icons/lu';

// Supondo que initialColaboradores venha de mockApi.js.
// Em uma aplicação real com Firestore, isso viria de um contexto ou seria passado como prop.
import { initialColaboradores } from '../data/mockApi';

/**
 * GenericFormModal Component
 * Um modal reutilizável para exibir formulários de adição/edição.
 * Utiliza Radix UI para acessibilidade e Tailwind CSS para estilização.
 *
 * @param {Object} props - As propriedades do componente.
 * @param {boolean} props.isOpen - Controla a visibilidade do modal.
 * @param {function} props.onClose - Callback para fechar o modal.
 * @param {function} props.onSave - Callback para salvar os dados do formulário.
 * @param {string} props.title - Título do modal.
 * @param {Object} props.initialData - Dados iniciais para preencher o formulário.
 * @param {React.ComponentType} props.formFieldsComponent - O componente que renderiza os campos do formulário.
 * @param {Array<Object>} props.categorias - Lista de categorias passadas para o componente de campos do formulário.
 */
export const GenericFormModal = ({
    isOpen,
    onClose,
    onSave,
    title,
    initialData = {},
    formFieldsComponent: FormFieldsComponent, // Renomeado para convenção de React
    categorias,
}) => {
    // Estado para gerenciar os dados do formulário dentro do modal
    const [formData, setFormData] = useState(initialData);
    // Estado para indicar se a operação de salvamento está em andamento
    const [isSaving, setIsSaving] = useState(false);

    // Efeito para resetar os dados do formulário quando o modal é aberto ou initialData muda
    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || {});
        }
    }, [initialData, isOpen]);

    /**
     * Manipulador genérico para mudanças nos campos do formulário.
     * Pode receber um evento (e.target) ou um objeto de atualização de campo direto (para campos complexos como objetos de FK).
     * @param {Event|Object} e_or_fieldUpdate - O evento de mudança ou um objeto com 'name' e 'value' do campo.
     */
    const handleChange = (e_or_fieldUpdate) => {
        if (e_or_fieldUpdate && e_or_fieldUpdate.target) {
            // Se for um evento de input HTML padrão (ex: text, select, checkbox)
            const { name, value, type, checked } = e_or_fieldUpdate.target;
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        } else {
            // Se for uma atualização direta de campo (ex: de um campo customizado ou para objetos como responsavel_FK)
            setFormData(prev => ({
                ...prev,
                ...e_or_fieldUpdate
            }));
        }
    };

    /**
     * Manipula o envio do formulário.
     * @param {Event} e - O evento de envio.
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previne o comportamento padrão de recarregar a página
        setIsSaving(true); // Ativa o estado de salvamento
        try {
            await onSave(formData); // Chama o callback de salvamento passado via props
            onClose(); // Fecha o modal após o salvamento bem-sucedido
        } catch (error) {
            console.error("Erro ao salvar item:", error);
            // Poderíamos adicionar uma mensagem de erro visível ao usuário aqui
        } finally {
            setIsSaving(false); // Desativa o estado de salvamento
        }
    };

    return (
        // Radix Dialog Root: Gerencia o estado de abertura/fechamento do modal
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            {/* Radix Dialog Portal: Garante que o modal seja renderizado fora da árvore DOM principal (para sobreposição) */}
            <Dialog.Portal>
                {/* Radix Dialog Overlay: O fundo escuro do modal */}
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 animate-overlayShow" />

                {/* Radix Dialog Content: O conteúdo principal do modal */}
                <Dialog.Content
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-2xl shadow-2xl
                                w-[95vw] max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] flex flex-col z-50
                                focus:outline-none animate-contentShow"
                    onEscapeKeyDown={onClose} // Fecha o modal ao pressionar ESC
                    onPointerDownOutside={onClose} // Fecha o modal ao clicar fora (se permitido)
                >
                    {/* Cabeçalho do Modal */}
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                        {/* Título do Modal */}
                        <Dialog.Title className="font-headline font-bold text-xl text-gray-900">
                            {title}
                        </Dialog.Title>
                        
                        {/* Botão de Fechar */}
                        <Dialog.Close asChild>
                            <button
                                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                aria-label="Fechar"
                            >
                                <LuX className="h-6 w-6" /> {/* Ícone de fechar */}
                            </button>
                        </Dialog.Close>
                    </div>

                    {/* Formulário (campos dinâmicos) */}
                    <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 flex-grow">
                        {/* Renderiza o componente de campos do formulário passado via props */}
                        {FormFieldsComponent && (
                            <FormFieldsComponent
                                formData={formData}
                                handleChange={handleChange}
                                isSaving={isSaving}
                                categorias={categorias}
                                colaboradores={initialColaboradores} // Passando colaboradores para o formFieldsComponent
                            />
                        )}
                    </form>

                    {/* Rodapé do Modal: Botões de Ação */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4 flex-shrink-0">
                        {/* Botão Cancelar */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-2 px-5 border border-gray-300 rounded-lg text-sm font-body font-medium text-gray-700 hover:bg-gray-100
                                       transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300"
                            disabled={isSaving}
                        >
                            Cancelar
                        </button>
                        {/* Botão Guardar */}
                        <button
                            type="submit"
                            form={`modalForm-${title.replace(/\s+/g, '-')}`} // Garante que o botão SUBMIT funcione se o form estiver em um componente filho
                            className="py-2 px-5 bg-blue-600 text-white rounded-lg shadow-md text-sm font-body font-medium
                                       hover:bg-blue-700 transition duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed
                                       flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <LuSave className="h-5 w-5" /> Guardar
                                </>
                            )}
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
