# Mosaic

> Every role is a piece.

A collaborative project platform that helps students find teammates, work on real-world projects, and build experience together.

## Problem

Students often have project ideas but struggle to find the right teammates. At the same time, students looking for experience may not know where to find projects with clearly defined roles.

Mosaic connects both sides through project-based role matching.

## Target users

- Students with project ideas who need teammates
- Students looking for practical project experience
- Early-career builders who want to showcase skills

## Product hypothesis

If project owners define the roles they need and builders can discover and apply to those roles, students can form project teams more easily than through informal networking alone.

## MVP

The prototype focuses on the core team-formation loop:

1. Discover projects
2. View open roles
3. Apply to a role
4. Project owner reviews applicants
5. Accepted applicants join the project

Supporting features include profiles, follows, notifications, chat and project updates.

## Product decisions

- **Role-based applications:** makes the team-building need explicit instead of relying on generic connection requests.
- **Project profiles:** give applicants enough context before applying.
- **Applicant review:** gives project owners control over team composition.
- **Seeded demo data:** keeps the prototype usable without requiring a backend.

## Project status

This is a **front-end prototype**.

- Data is stored in the browser's `localStorage`.
- There is no backend or database yet.
- The app starts with seeded demo users, projects and updates.

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS 4 · Motion · Lucide

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

## Next

- Validate the core discovery → application → acceptance flow with students
- Real backend and authentication
- Skill-based matching between builders and open roles

## What I learned

Mosaic was an exercise in turning a broad problem — “students need teams” — into a narrower product loop that can be prototyped and validated.
