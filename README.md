# Mosaic

> Every role is a piece.

An AI-powered collaborative project platform that helps students find teammates, work on real-world projects, and build experience together.

**Product spec:** [Mosaic PRD](https://github.com/sashmithagandhi/mosaic-prd)

## The problem

Students and early-career builders have ideas but no team, and teams have open roles but no easy way to find the right people. Mosaic matches the two: a project owner posts a project with specific roles, and builders apply to the role that fits their skills.

## What you can do

- **Post a project** with a tagline, category, meeting rhythm, duration and the specific roles you need.
- **Apply to a role** on a project that fits your skills.
- **Review applicants** and accept or reject them. Accepting fills the role slot and notifies the applicant.
- **Follow other builders**, get notifications, and see project updates in a feed.
- **Chat** with other members.
- **Build a profile** with college, course, target role, skills, portfolio links and LinkedIn.
- **See your team** across the projects you own or have joined.
- A short **onboarding guide** walks new users through the app.

## Project status

This is a front-end prototype.

- All data is stored in the browser's `localStorage`. There is no backend or database yet.
- The app starts with seeded demo users, projects and updates so every screen has content.

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS 4 · Motion · Lucide

## Run locally

```bash
npm install
cp .env.example .env
npm run dev   # http://localhost:3000
```

## Next

- Real backend and authentication
- Skill-based matching between builders and open roles
