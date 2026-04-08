# ⚡ GigaClean - Modern File Cleaner GUI

![GigaClean Banner](https://img.shields.io/badge/GigaClean-Modern%20PC%20Cleaner-4f46e5?style=for-the-badge&logo=electron&logoColor=white)

**GigaClean** é uma interface desktop moderna, profissional e de alto desempenho projetada para transformar scripts de limpeza em uma experiência visual intuitiva. Construído com **Electron**, **Vite** e **React**, o GigaClean integra-se diretamente com scripts Python para realizar manutenções profundas no sistema.

---

## ✨ Funcionalidades

*   **📊 Dashboard Inteligente**: Visualize o nível de "sujeira" do seu sistema através de um medidor circular em tempo real.
*   **🔎 Análise de Localização**: Detalhamento individual das pastas `Temp` (Usuário e Windows) e `Prefetch`, com contagem de arquivos e caminhos completos.
*   **📜 Histórico de Operações**: Um log completo e persistente de todas as limpezas realizadas durante a sessão.
*   **🐍 Integração Python**: O app executa o seu script Python original nos bastidores, garantindo a eficácia da limpeza que você já confia.
*   **🛡️ Detecção de Privilégios**: Feedback visual imediato se o app está rodando em Modo Administrador ou Comum.

## 🚀 Tecnologias Utilizadas

*   **Frontend**: React.js com Vite (HMR ultra-rápido)
*   **Desktop**: Electron Framework
*   **Estilização**: CSS3 com Design System sob medida (Dark Mode)
*   **Animações**: Framer Motion
*   **Ícones**: Lucide React
*   **Backend**: Node.js (Filesystem API) + Python Child Process

## 🛠️ Como Executar o Projeto

### Pré-requisitos
*   [Node.js](https://nodejs.org/) instalado.
*   [Python 3.x](https://www.python.org/) no PATH do sistema.

### Passos
1. **Clonar o repositório**
   ```bash
   git clone https://github.com/seu-usuario/gigaclean.git
   cd gigaclean/gui-cleaner
   ```

2. **Instalar dependências**
   ```bash
   npm install
   ```

3. **Executar em modo de desenvolvimento**
   ```bash
   npm run dev
   ```

## ⚖️ Licença

Este projeto está sob a licença **ISC**.

---

*Desenvolvido com ❤️ para transformar scripts simples em ferramentas de classe mundial.*
