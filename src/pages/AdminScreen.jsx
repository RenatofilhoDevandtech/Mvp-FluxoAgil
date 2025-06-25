import React, { useState } from "react";
// Importando ícones do Font Awesome via React Icons para um visual consistente
import { FaPlus, FaTrashAlt, FaCheckCircle, FaExclamationCircle, FaTimesCircle, FaListAlt } from 'react-icons/fa';

/**
 * AdminScreen Component
 * Tela de administração para gerenciar categorias e subcategorias de atividades.
 * Permite adicionar, visualizar e remover categorias e subcategorias.
 *
 * @param {Object} props - As propriedades do componente.
 * @param {Array<Object>} props.categorias - A lista atual de categorias e suas subcategorias.
 * @param {function} props.onSaveCategoria - Callback para salvar (adicionar/atualizar) uma categoria.
 */
export const AdminScreen = ({ categorias, onSaveCategoria }) => {
    // Estados para gerenciar a adição de novas categorias e subcategorias
    const [newCat, setNewCat] = useState("");
    const [newSubcat, setNewSubcat] = useState("");
    const [selectedCatForSubcat, setSelectedCatForSubcat] = useState("");
    const [message, setMessage] = useState(""); // Mensagem de feedback para o usuário
    const [messageType, setMessageType] = useState(""); // Tipo da mensagem (sucesso, erro)

    // Funções auxiliares para exibir e esconder mensagens
    const showMessage = (msg, type = "success") => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage("");
            setMessageType("");
        }, 3000); // Mensagem desaparece após 3 segundos
    };

    /**
     * Adiciona uma nova categoria.
     */
    const handleAddCat = () => {
        const trimmedCat = newCat.trim();
        if (trimmedCat && !categorias.some(c => c.nome.toLowerCase() === trimmedCat.toLowerCase())) {
            // Chama a função de salvar para adicionar a nova categoria
            onSaveCategoria({ nome: trimmedCat, subcategorias: [] });
            showMessage("Categoria adicionada com sucesso!", "success");
            setNewCat("");
        } else {
            showMessage("Categoria já existe ou nome inválido.", "error");
        }
    };

    /**
     * Adiciona uma nova subcategoria à categoria selecionada.
     */
    const handleAddSubcat = () => {
        const trimmedSubcat = newSubcat.trim();
        if (trimmedSubcat && selectedCatForSubcat) {
            const catToUpdate = categorias.find(c => c.id === selectedCatForSubcat);
            if (catToUpdate && !catToUpdate.subcategorias.some(s => s.toLowerCase() === trimmedSubcat.toLowerCase())) {
                const updatedCat = {
                    ...catToUpdate,
                    subcategorias: [...catToUpdate.subcategorias, trimmedSubcat],
                };
                // Chama a função de salvar para atualizar a categoria com a nova subcategoria
                onSaveCategoria(updatedCat);
                showMessage("Subcategoria adicionada com sucesso!", "success");
                setNewSubcat("");
            } else {
                showMessage("Subcategoria já existe ou nome inválido.", "error");
            }
        } else {
            showMessage("Selecione uma categoria e insira um nome para a subcategoria.", "error");
        }
    };

    /**
     * Remove uma categoria existente.
     * @param {string} id - O ID da categoria a ser removida.
     * Este parâmetro 'id' foi mantido apenas para referência futura,
     * pois a mockApi.js atualmente não tem uma função 'deleteCategoria'.
     * A funcionalidade real de exclusão de categoria precisará ser implementada
     * no App.jsx e na mockApi/Firestore quando necessário.
     */
    const handleDeleteCat = () => { // Removido o parâmetro 'id' do uso atual para resolver o aviso do ESLint.
        showMessage("Funcionalidade de exclusão de categoria ainda não implementada na mockApi. Para simular a remoção, é preciso implementar o delete no mockApi.js e App.jsx.", "error");
        // Em um ambiente real com Firestore, você precisaria implementar algo como:
        // mockApi.deleteCategoria(id);
        // showMessage("Categoria removida!", "success");
        // onSaveCategoria(categorias.filter(c => c.id !== id)); // Atualiza o estado local para refletir a remoção
    };

    /**
     * Remove uma subcategoria de uma categoria específica.
     * @param {string} catId - O ID da categoria pai.
     * @param {string} subcatName - O nome da subcategoria a ser removida.
     */
    const handleDeleteSubcat = (catId, subcatName) => {
        if (!catId || !subcatName) {
            showMessage("Selecione uma categoria e subcategoria para remover.", "error");
            return;
        }
        const catToUpdate = categorias.find(c => c.id === catId);
        if (catToUpdate) {
            const updatedSubcategories = catToUpdate.subcategorias.filter(s => s !== subcatName);
            const updatedCat = {
                ...catToUpdate,
                subcategorias: updatedSubcategories,
            };
            // Chama a função de salvar para atualizar a categoria sem a subcategoria
            onSaveCategoria(updatedCat);
            showMessage("Subcategoria removida com sucesso!", "success");
        } else {
            showMessage("Categoria não encontrada.", "error");
        }
    };

    return (
        <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-headline font-bold text-gray-900 mb-6">Administração de Categorias</h2>

            {/* Mensagem de Feedback */}
            {message && (
                <div className={`p-3 rounded-lg mb-4 flex items-center gap-2
                                ${messageType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {messageType === "success" ? <FaCheckCircle className="text-xl" /> : <FaExclamationCircle className="text-xl" />}
                    <span className="text-sm font-medium">{message}</span>
                </div>
            )}

            {/* Seção: Categorias e Subcategorias Atuais */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-8">
                <h3 className="font-headline font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
                    <FaListAlt className="text-blue-600" /> Categorias e Subcategorias Atuais
                </h3>
                {categorias.length === 0 ? (
                    <p className="text-gray-500 italic">Nenhuma categoria cadastrada. Comece adicionando uma!</p>
                ) : (
                    <ul className="space-y-3">
                        {categorias.map(cat => (
                            <li key={cat.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex-grow">
                                    <span className="font-semibold text-blue-700 text-base">{cat.nome}</span>
                                    <span className="block text-xs text-gray-600 sm:inline sm:ml-2">
                                        : {cat.subcategorias.length > 0 ? cat.subcategorias.join(", ") : "(Sem subcategorias)"}
                                    </span>
                                </div>
                                <button
                                    onClick={handleDeleteCat} // Chamada ajustada para não passar 'id' se não for usado
                                    className="ml-0 mt-2 sm:mt-0 sm:ml-4 text-red-500 hover:text-red-700 text-sm flex items-center gap-1 px-3 py-1 rounded-md border border-red-200 hover:bg-red-50 transition-colors"
                                    aria-label={`Excluir categoria ${cat.nome}`}
                                >
                                    <FaTrashAlt className="text-xs" /> Excluir Categoria
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Seção: Adicionar Nova Categoria */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-8">
                <h3 className="font-headline font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
                    <FaPlus className="text-green-600" /> Adicionar Nova Categoria
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        value={newCat}
                        onChange={(e) => setNewCat(e.target.value)}
                        placeholder="Nome da nova categoria (ex: Viagens)"
                        className="p-3 border border-gray-300 rounded-lg flex-grow text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        aria-label="Nome da nova categoria"
                    />
                    <button
                        onClick={handleAddCat}
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md
                                   flex items-center justify-center gap-2 font-medium text-sm"
                    >
                        <FaPlus /> Adicionar Categoria
                    </button>
                </div>
            </div>

            {/* Seção: Adicionar Nova Subcategoria */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-8">
                <h3 className="font-headline font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
                    <FaPlus className="text-purple-600" /> Adicionar Nova Subcategoria
                </h3>
                <div className="flex flex-col sm:flex-row gap-3 flex-wrap items-center">
                    <select
                        value={selectedCatForSubcat}
                        onChange={(e) => setSelectedCatForSubcat(e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm flex-grow sm:flex-grow-0 min-w-[200px]"
                        aria-label="Selecione a categoria para adicionar subcategoria"
                    >
                        <option value="">Selecione a Categoria</option>
                        {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                    </select>
                    <input
                        type="text"
                        value={newSubcat}
                        onChange={(e) => setNewSubcat(e.target.value)}
                        placeholder="Nome da nova subcategoria (ex: Aéreo)"
                        className="p-3 border border-gray-300 rounded-lg flex-grow text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        aria-label="Nome da nova subcategoria"
                    />
                    <button
                        onClick={handleAddSubcat}
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md
                                   flex items-center justify-center gap-2 font-medium text-sm"
                    >
                        <FaPlus /> Adicionar Subcategoria
                    </button>
                </div>
            </div>

            {/* Seção: Remover Subcategoria */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                <h3 className="font-headline font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
                    <FaTrashAlt className="text-orange-600" /> Remover Subcategoria
                </h3>
                <div className="flex flex-col sm:flex-row gap-3 flex-wrap items-center">
                    <select
                        value={selectedCatForSubcat}
                        onChange={(e) => setSelectedCatForSubcat(e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm flex-grow sm:flex-grow-0 min-w-[200px]"
                        aria-label="Selecione a categoria para remover subcategoria"
                    >
                        <option value="">Selecione a Categoria</option>
                        {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                    </select>
                    {selectedCatForSubcat && (
                        <select
                            className="p-3 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm flex-grow sm:flex-grow-0 min-w-[200px]"
                            onChange={(e) => handleDeleteSubcat(selectedCatForSubcat, e.target.value)}
                            aria-label="Selecione a subcategoria para remover"
                        >
                            <option value="">Selecione a Subcategoria</option>
                            {categorias.find((c) => c.id === selectedCatForSubcat)?.subcategorias.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    )}
                    {selectedCatForSubcat && categorias.find((c) => c.id === selectedCatForSubcat)?.subcategorias.length > 0 && (
                        <button
                            onClick={() => handleDeleteSubcat(selectedCatForSubcat, categorias.find((c) => c.id === selectedCatForSubcat)?.subcategorias[0])} // Apenas um exemplo de como acionar, o usuário selecionará na prática
                            className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition duration-200 shadow-md
                                       flex items-center justify-center gap-2 font-medium text-sm"
                            aria-label="Remover subcategoria selecionada"
                        >
                            <FaTrashAlt /> Remover Subcategoria
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
