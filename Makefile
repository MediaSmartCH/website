# Makefile pour sparklet.ai / MediaSmart
# Application React + TypeScript + Vite

.PHONY: help install dev start build preview analyze clean lint

# Couleurs pour l'affichage
CYAN := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RESET := \033[0m

# Commande par défaut
.DEFAULT_GOAL := help

## Afficher l'aide
help:
	@echo ""
	@echo "$(CYAN)═══════════════════════════════════════════════════════════$(RESET)"
	@echo "$(GREEN)  Makefile - sparklet.ai$(RESET)"
	@echo "$(CYAN)═══════════════════════════════════════════════════════════$(RESET)"
	@echo ""
	@echo "$(YELLOW)Commandes disponibles:$(RESET)"
	@echo ""
	@echo "  $(GREEN)make install$(RESET)    - Installer les dépendances npm"
	@echo "  $(GREEN)make dev$(RESET)        - Lancer le serveur de développement (port 3000)"
	@echo "  $(GREEN)make start$(RESET)      - Alias pour 'make dev'"
	@echo "  $(GREEN)make build$(RESET)      - Build de production (dans dist/)"
	@echo "  $(GREEN)make preview$(RESET)    - Prévisualiser le build de production"
	@echo "  $(GREEN)make analyze$(RESET)    - Build avec analyse du bundle"
	@echo "  $(GREEN)make clean$(RESET)      - Nettoyer les fichiers générés"
	@echo ""

## Installer les dépendances
install:
	@echo "$(CYAN)📦 Installation des dépendances...$(RESET)"
	pnpm install

## Lancer le serveur de développement
dev:
	@echo "$(CYAN)🚀 Lancement du serveur de développement...$(RESET)"
	@echo "$(GREEN)→ http://localhost:3000$(RESET)"
	pnpm run dev

## Alias pour dev
start: dev

## Build de production
build:
	@echo "$(CYAN)🔨 Build de production...$(RESET)"
	pnpm run build
	@echo "$(GREEN)✅ Build terminé dans dist/$(RESET)"

## Prévisualiser le build de production
preview: build
	@echo "$(CYAN)👀 Prévisualisation du build de production...$(RESET)"
	parnpm run preview

## Analyser le bundle
analyze:
	@echo "$(CYAN)📊 Analyse du bundle...$(RESET)"
	pnpm run analyze
	@echo "$(GREEN)✅ Rapport généré: bundle-report.html$(RESET)"

## Nettoyer les fichiers générés
clean:
	@echo "$(CYAN)🧹 Nettoyage...$(RESET)"
	rm -rf dist
	rm -rf node_modules/.vite
	rm -f bundle-report.html
	@echo "$(GREEN)✅ Nettoyage terminé$(RESET)"
