# Kanpeki - A Japanese Practice Website by Gage Witcig

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-FF1E56?style=for-the-badge&logo=turborepo&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)


![License](https://img.shields.io/github/license/gwitcig2/Japanese-Practice-Website?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

**TLDR: Kanpeki is a MERN monorepo that AI-generates Japanese reading exercises, tokenizes paragraphs with dictionary data for each word,
and allows for words to be added to flashcard decks with just a click.** 

## Intro

Welcome to Kanpeki, a free practice tool for English speakers learning Japanese. 
This website is structured to help learners improve their reading and listening comprehension
by translating AI-generated Japanese paragraphs to English. These paragraphs are tokenized
to include dictionary data for each word, available to the user through just a click rather
than a whole Google search. Additionally, users will be able to seamlessly add these
vocabulary words to flashcard decks, which will use spaced repetition to efficiently keep
vocabulary locked into long-term memory. Overall, these features combine to make Kanpeki a 
tool that emphasizes engaged, disciplined, and efficient practice with the Japanese language.

Currently, the full-stack for this website is being developed entirely by me, Gage Witcig 
(@gwitcig2).


## Table of Contents

- [Base Features](#base-features)
  - [Readings](#readings)
  - [Flashcards](#flashcards)
  - [Planned Features](#planned-features)
- [Tech Stack Overview](#tech-stack-overview)
- [Project Directory Structure](#project-directory-structure)
- [Copyright Resources](#copyright-resources)
  - [The Japanese Multilingual Dictionary (JMDict)](#the-japanese-multilingual-dictionary-jmdict)

## Base Features

### Readings

- AI-Generate a random Japanese paragraph with customizable parameters like JLPT level, 
story themes, and paragraph length.
- Built-in aids:
  - Toggleable furigana automatically added to kanji.
  - Click on any word to view their JMDict definitions, pronunciation, or add it to one of 
  your flashcard decks.
  - Optional text-to-speech reading of the paragraph for listening practice.
- Enter your own English translations of each sentence, then compare with the actual English 
translations.
- Keep a collection of your readings for 7 days for short-term reference.

### Flashcards

- Create and manage your own flashcard decks, similar to Anki.
- Study through your decks in a randomized order, using spaced repetition to prioritize what 
you struggle with most.
- Export decks as `.apkg` files if you would rather use Anki.

### User Customizations

- Toggleable light/dark modes
- Account customization and basic control (change password, username, profile picture, so on)

## Planned Features

- AI-generated practice quizzes for grammar concepts taught in the Genki textbooks
  (would need to be cautious of copyright).
- Daily streak / incentive system, similar to Duolingo.
- Support for multiple languages (e.g. translating Dictionary data to *any* language via a third-party API, and instructions)

## Tech Stack Overview

Kanpeki is a monorepo built on a [MongoDB](https://www.mongodb.com/docs/), [Express](https://expressjs.com/), [React](https://react.dev/learn) and [Node.js](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs) (MERN) tech stack.

The front-end (`/web`) is structured to be a single-page application (SPA) built with [React](https://react.dev/learn), [TypeScript](https://www.typescriptlang.org/docs/), 
and [Tailwind](https://tailwindcss.com/docs/installation/using-vite). [Vite](https://vite.dev/guide/) is used for hosting the dev server and building for deployment to [Vercel](https://vercel.com/docs). 

Some of the other key libraries used in `/web`:
- [shacn/ui components](https://ui.shadcn.com/docs)
- [framer-motion](https://motion.dev/docs/react)
- [react-router-dom](https://reactrouter.com/home)
- [axios](https://axios-http.com/docs/intro)

The back-end (`/api`) is an [Express](https://expressjs.com/) server that uses REST APIs to handle CRUD operations on resources, [JWT](https://auth0.com/docs/secure/tokens/json-web-tokens) authorization, and
executing services like the paragraph creation pipeline. The [Mongoose ODM](https://mongoosejs.com/docs/index.html) is used to handle transactions with the remote [MongoDB](https://www.mongodb.com/docs/), hosted
on Atlas. The DB itself stores the [JMDict](#the-japanese-multilingual-dictionary-jmdict) in JSON format so we can remotely query it for dictionary data. Otherwise, it just holds basic user data, including
their flashcard collections and all the readings they have created over the last 7 days. In the short-term, `/api` will be deployed to [Railway](https://docs.railway.com/quick-start) for production,
but long-term, it would be better to containerize `/api` with [Docker](https://docs.docker.com/get-started/) and host it on a home lab.

Some of the other key libraries used in `/api`:
- [kuromojin](https://github.com/azu/kuromojin) (a handy wrapper for the [kuromoji](https://github.com/takuyaa/kuromoji.js) tokenizer)
- [bcrypt](https://www.npmjs.com/package/bcrypt) (hash passwords and refresh tokens before storing them in the DB)
- [openai](https://platform.openai.com/docs/quickstart?context=node)

Shared code between the apps is held in `/packages`. Right now these just hold [zod](https://zod.dev/) schemas and global config for [TypeScript](https://www.typescriptlang.org/docs/) and [eslint](https://typescript-eslint.io/getting-started/).

On the development side of things, [Turborepo](https://turborepo.com/docs) is used to enhance monorepo management and speed up CI/CD via GitHub. [pnpm](https://pnpm.io/motivation) is the preferred package manager for its speedy downloads, efficient disk-usage, and simple monorepo support. 
[Notion](https://www.notion.com/) is used for task management and maintaining the devlog. And lastly, [Vitest](https://vitest.dev/guide/) is used for unit testing the project.



## Project Directory Overview

- `/root`
  - `/apps` - Deployable Applications
    - `/web` - React + Vite SPA
      - `/src`
        - `/features` - Holds collections of React components needed by a feature of the website.
          - `/auth` - Formats the layout and authorization pages like signup, login, and a settings page.
          - `/reading` - Sets up the pages for customizing the prompt to create a Japanese reading, make an API request to generate the reading, and then route to the page that displays the reading.
        - `/utils` - TypeScript function libraries that may need to be used across the front-end.
    - `/api` - Express server with REST APIs.
      - `/controllers` - MVC-styled controllers that handle requests.
      - `/middleware` - Filters for validating requests and logging output.
      - `/models` - Mongoose schemas.
      - `/routes` - Sets up routes and routers for API requests.
      - `/scripts` - Code for performnig one-off tasks.
      - `/services` - Dedicated logic for API requests.
        - `/ai` - Modularize prompts to ChatGPT's `4o-mini` model.
        - `/deck` - CRUD functions for flashcard decks.
        - `/flashcard` - CRUD operation functions for flashcards.
        - `/jwt` - Functions that create, verify, and revoke JWTs.
        - `/reading` - Functions that set up the paragraph creation pipeline.
        - `/user` - CRUD functions for user accounts.
      - `/tests` - Vitest unit tests verifying the APIs work as intended
      - `server.js` 
  - `/packages` - Shared code and config between the `/apps`
    - `/formSchemas` - `zod` form schemas
  - `turbo.json` - Config for Turborepo. Essentially tells it how to run scripts.


## API Request Overview

### /users (userRouter.js)

- `POST /users` -> Creates a new user
- `PUT /users/:id` -> Updates a user's email, username, and/or password
- `DELETE /users/:id` -> Removes a user

### /sessions (sessionsRouter.js)

- `POST /sessions` -> Handles logging a user in and giving them both an access JWT and a refresh JWT
- `PUT /sessions` -> Checks if a user has a valid refresh JWT, and if they do, renew the user's access JWT
- `DELETE /sessions` -> Handles logout or expiration of a refresh JWT

### /decks (flashcardRouter.js)

- `GET /decks` -> Retrieves all of a user's flashcard decks, populating each deck with flashcards tied to the deck's objectId.
- `POST /decks` -> Creates a new flashcard deck.
- `GET /decks/:deckId` -> Retrieves one flashcard deck by its objectId
- `PUT /decks/:deckId` -> Updates a deck's name and/or description.
- `DELETE /decks/:deckId` -> Deletes a deck and its flashcards.


- `POST /decks/:deckid/flashcards` -> Adds a new flashcard to a deck.
- `PUT /decks/:deckId/flashcards/:flashcardId` -> Can update a flashcard's front, back, or deckId properties.
- `DELETE /decks/:deckId/flashcards/:flashcardId` -> Deletes a flashcard entirely.

### /reading (readingRouter.js)

- `POST /reading/setupReading` -> Return the results of the paragraph creation pipeline

## Install Instructions

In your terminal, clone the repo in a directory:

```bash
  git clone https://github.com/gwitcig2/Japanese-Practice-Website.git
```

`cd` into the project and install its dependencies:

```bash
  cd japanese-practice-website
  pnpm install
```

Be sure that `pnpm` is globally installed on your computer for this step. As a sanity-check, ensure that all dependencies were successfully installed by
going through the `package.json` files and checking for warnings thrown by your IDE. If dependencies are missing in a directory, such as `/web`,
it should be resolved by running `cd` into that directory, then `pnpm install`.

After installing dependencies, it's highly recommended, but technically not required, to add `turbo` from Turborepo globally:
```bash
  pnpm add turbo --global
```
This allows you to run scripts through `turbo` directly in the terminal, as opposed to running them with `pnpm` commands.
A global `turbo` is handy for configuring CI pipelines and performing one-off tasks like `build` in specific areas of the project.

Now ensure there's a `.env` at the root and it contains valid variables. There's a `zod` schema for verifying syntax, along with
a visual outline below:

```env
NODE_ENV= ["dev" | "test" | "prod"] (default "dev")
SERVER_PORT= whatever port you want for the Express server
VITE_CLIENT_PORT= whatever port you want for the Vite server
JWT_KEY= unique SHA-256 hash
JWT_REFRESH_KEY= unique SHA-256 hash
VITE_API_READING=(routes to the request for the setupReading pipeline)
CLIENT_ORIGIN=expected http origin of clients
MONGO_URI= valid URI to the remote MongoDB
```

From here, you should be ready begin development!

Quick outline of root directory tasks to execute in the terminal:
  - `pnpm dev` or `turbo dev` to fire up the dev servers (Vite & Express in parallel)
  - `pnpm build` or `turbo build` to build the entire monorepo for deployment
  - `pnpm lint` or `turbo lint` to perform linting of the entire monorepo
  - `pnpm test` or `turbo test` to execute Vitest unit tests
  - `pnpm check-types` or `turbo check-types` to type-check TypeScript code with `tsc`

`turbo` can run multiple tasks in parallel (e.g. `turbo lint build check-types`).

If you need to perform tasks only in certain directories, either use filters or `cd` to the directory you're working in.

## Copyright Resources

### The Japanese Multilingual Dictionary (JMDict)

Property of the [Electronic Dictionary Research and Development Group](https://www.edrdg.org/) and used in compliance with their [license](https://www.edrdg.org/edrdg/licence.html).