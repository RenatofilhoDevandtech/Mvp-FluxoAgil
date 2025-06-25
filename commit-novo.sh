#!/bin/bash

# Verifica se está dentro de um repositório Git
if ! git rev-parse --is-inside-work-tree &> /dev/null; then
  echo "❌ Este diretório não é um repositório Git."
  exit 1
fi

# Coleta modificações, remoções e novos arquivos
arquivos=$(git status -s | awk '{print $2}')

# Commita um por um com mensagem personalizada
for arquivo in $arquivos; do
  git add "$arquivo" 2>/dev/null || git rm "$arquivo"
  nome=$(basename "$arquivo")

  case "$arquivo" in
    package*.json) tipo="chore: :package: atualiza dependências do projeto" ;;
    src/App.jsx) tipo="refactor: :recycle: ajustes na estrutura principal da app" ;;
    src/assets/Logo-Mdias.svg) tipo="refactor: :fire: remove logotipo antigo do projeto" ;;
    public/Logo-Mdias.svg) tipo="feat: :art: novo logotipo adicionado ao public/" ;;
    .anima/*) tipo="chore: :nail_care: adiciona arquivos do Anima Studio" ;;
    src/components/*) tipo="feat: :sparkles: novos componentes adicionados" ;;
    src/data/*) tipo="chore: :memo: dados locais adicionados" ;;
    src/pages/*) tipo="feat: :rocket: novas páginas implementadas" ;;
    src/utils/*) tipo="refactor: :wrench: funções utilitárias adicionadas" ;;
    *) tipo="chore: :hammer: atualização em $nome" ;;
  esac

  echo -e "\n📄 Arquivo: $arquivo"
  echo "🔧 Sugestão: $tipo"
  read -p "📝 Deseja editar a mensagem? (ENTER para manter): " msg

  [[ -z "$msg" ]] && msg="$tipo"

  git commit -m "$msg"
done

echo -e "\n✅ Commits finalizados. Deseja fazer push agora?"
read -p "📤 Digite 's' para enviar para a branch atual: " pushresposta

if [[ "$pushresposta" == "s" ]]; then
  branch=$(git rev-parse --abbrev-ref HEAD)
  git push origin "$branch"
fi
