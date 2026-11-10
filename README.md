# MBTI Playground Web 🎮

An interactive, data-driven MBTI scenario web platform built with Angular.  
This project serves as a content hub for YouTube interactive decision-making videos, allowing users to experience branching dilemmas and discover their survival personality types.

> **Disclaimer**: This is an unofficial, non-profit fan-made project. All trademarks and story inspirations belong to their respective copyright holders. No copyrighted imagery, logos, or proprietary music are used.

---

## 🚀 Key Features

- **Interactive Scenario Player**: Branching dilemma choices driven by clean JSON trees.
- **YouTube Integration**: Embed-based video node transitions without heavy video hosting overhead.
- **Multi-language Support (Planned)**: Runtime locale switching between Korean (KO), English (EN), and German (DE).
- **Type-Safe Architecture**: Strict TypeScript models separating data structures from view components.

---

## 🛠️ Tech Stack

- **Framework**: Angular (Standalone Components, Signals, Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: SCSS
- **Content Engine**: Pure JSON-driven story models

---

## 📁 Project Structure

```text
src/app/
├── core/             # Services, models (TypeScript interfaces), shared utilities
├── features/         # Feature modules (home, tests, results, about)
│   └── home/         # Landing / hub component
content/              # Read-only scenario & localization JSON files
docs/                 # Development notes & learning log (LEARNING_LOG.md)
