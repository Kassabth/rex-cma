# REX CMA CGM — Application Interactive Devoteam

Application web mobile-first pour la présentation REX (Retour sur Expérience) de la mission Devoteam × CMA CGM.

**Accès public :** déployez sur Vercel (gratuit) — voir [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## Stack Technique

| Composant | Technologie |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Globe 3D | react-globe.gl (Three.js) |
| Graphiques | Recharts |
| Chatbot LLM | Google Gemini API (gemini-1.5-flash) |
| Icons | lucide-react |
| Animations | CSS keyframes + Framer Motion |
| Déploiement | Vercel (recommandé) |

---

## Démarrage local

### Prérequis
- Node.js 18+
- Une clé API Gemini (pour le chatbot) → [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

```bash
# Cloner le projet
git clone https://github.com/YOUR_USERNAME/rex-cma.git
cd rex-cma

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local et ajouter votre GEMINI_API_KEY

# Lancer en développement
npm run dev
```

L'application est disponible sur [http://localhost:3000](http://localhost:3000).

---

## Structure du Projet

```
rex-cma/
├── app/
│   ├── layout.tsx          # Layout principal, métadonnées
│   ├── page.tsx            # Page principale (routing par onglets)
│   ├── globals.css         # Styles globaux, variables CSS
│   └── api/chat/
│       └── route.ts        # API Gemini (streaming SSE)
├── components/
│   ├── Navigation.tsx      # Barre de navigation du bas
│   ├── GlobeWrapper.tsx    # Globe 3D (dynamic import)
│   ├── AnimatedCounter.tsx # Compteurs animés au scroll
│   └── tabs/
│       ├── Tab1Overview.tsx    # Présentation du compte
│       ├── Tab2Evolution.tsx   # Évolution de la mission
│       ├── Tab3Team.tsx        # Organigramme équipe
│       ├── Tab4Domains.tsx     # Domaines d'intervention
│       ├── Tab5Challenges.tsx  # Défis & Perspectives
│       └── Tab6Chatbot.tsx     # Chatbot Gemini
├── data/
│   └── content.ts          # ← TOUTES les données et textes
├── chatbot/
│   └── system_prompt.txt   # ← Prompt système du chatbot
├── .env.example            # Variables d'environnement (template)
├── DEPLOYMENT.md           # Guide de déploiement détaillé
└── README.md               # Ce fichier
```

---

## Mettre à jour le contenu

**Toute la donnée de l'app est centralisée dans un seul fichier :**

```
data/content.ts
```

### Ce que vous pouvez modifier sans toucher aux composants :

| Données | Variable dans content.ts |
|---|---|
| Ports du globe + fun facts | `globePorts` |
| Statistiques CMA CGM | `cmaStats` |
| Timeline partenariat | `partnershipTimeline` |
| Facts intéressants | `cmaFacts` |
| Statistiques mission 2024 | `missionStats2024` |
| Statistiques mission 2025 | `missionStats2025` |
| Données du graphique effectifs | `headcountData` |
| Jalons 2024–2025 | `milestones` |
| Projections 2026 | `projections2026` |
| Équipe (organigramme) | `teamData` |
| Practices EA et Archi4IT | `practiceAreas` |
| Cartes défis | `challenges` |
| Message d'accueil chatbot | `chatbotWelcomeMessage` |
| Questions suggérées chatbot | `chatbotSuggestedQuestions` |

### Exemple — Ajouter un membre d'équipe

Dans `data/content.ts`, trouvez `teamData` et ajoutez un enfant :

```typescript
{
  id: 'ea-4',
  name: 'Marie Dupont',           // Remplace "TODO — [Consultant]"
  role: 'Senior Consultant EA',
  practice: 'ea',
  currentProject: 'Cartographie domaine Supply Chain',
  children: [],
}
```

---

## Mettre à jour le prompt du chatbot

Le contexte donné au chatbot est dans :

```
chatbot/system_prompt.txt
```

Éditez ce fichier pour :
- Ajouter les vrais noms de l'équipe
- Préciser les projets réels en cours
- Enrichir le contexte CMA CGM avec des données internes
- Ajuster le ton ou les instructions

Aucun redéploiement n'est nécessaire en local (rechargé à chaque requête). En production sur Vercel, un simple redéploiement suffit.

---

## Déploiement

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour le guide complet Vercel.

**TL;DR :**
1. Pushez sur GitHub
2. Importez sur [vercel.com](https://vercel.com)
3. Ajoutez `GEMINI_API_KEY` dans les variables d'environnement Vercel
4. Partagez l'URL publique avec vos 50 participants

---

## Sections TODO

Cherchez `TODO` dans `data/content.ts` pour trouver toutes les données à remplacer avant la présentation. Chaque placeholder est clairement marqué.

---

## Scripts disponibles

```bash
npm run dev      # Développement (hot reload)
npm run build    # Build de production
npm run start    # Serveur de production local
npm run lint     # ESLint
```
