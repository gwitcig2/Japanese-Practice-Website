# Japanese Practice Website by Gage Witcig

This website is intended to be a free, all-in-one resource for English speakers learning Japanese. It will be primarily structured to help learners improve their reading and listening comprehension by translating AI-generated Japanese paragraphs to English. It will also give them the 
ability to effortlessly create flashcard decks for vocabulary and kanji directly from these readings, eliminating the
hassle of manually creating each card in a deck.

Currently, the full-stack for this website is being developed entirely by me, Gage Witcig (@gwitcig2).

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

- AI-Generate a random Japanese paragraph with customizable parameters like JLPT level, story themes, and paragraph length.
- Built-in aids:
  - Toggleable furigana automatically added to kanji.
  - Click on any word to view their JMDict definitions, pronunciation, or add it to one of your flashcard decks.
  - Optional text-to-speech reading of the paragraph for listening practice.
- Enter your own English translations of each sentence, then compare with the actual English translations.
- Keep a collection of your readings for later practice.

### Flashcards

- Create and manage your own flashcard decks, similar to Anki and Quizlet.
- Study through your decks in a randomized order that prioritizes what you are struggling with.
- Export decks as `.apkg` files if you would rather use Anki.

## Planned Features

- AI-generated practice quizzes for grammar concepts taught in the Genki textbooks.
- Daily streak / incentive system, similar to Duolingo.

## Tech Stack Overview

This website is currently built on a MongoDB, Express, React and NodeJS (MERN) tech stack.

- `React & TailwindCSS` - No-brainers for building a sleek, snappy, and fully customized single-page application.
- `TypeScript` - Used solely in the client-side so that error-checking and code readability are enhanced, making prototyping with Vite's Hot Module Replacement as comprehensive as possible.
- `JavaScript` - Used primarily in the server-side to avoid over-complicating function pipelines with custom types. Also avoids mis-representing data returned by pure-JavaScript libraries. 
  - Migrating server-side files to TypeScript may occur if code-readability and/or error-checking become too tedious.
- `MongoDB` - Currently hosted on an Atlas free plan. Stores the JMDict formatted in JSON due to its size (~100MB). Also stores a collection of AI-generated Japanese paragraphs organized by JLPT level. Will eventually store simple user data like their readings and their flashcard decks.
- `Mongoose` - ODM used in the server-side to retrieve to randomly select from collection of Japanese paragraphs and to batch-query JMDict for the English definitions of an array of Japanese words. 
- `Express` - Sets up routing for HTTP requests and establishes CORS middleware for the server.
- `Node.js` - No-brainer server runtime for the pure JavaScript libraries that make this website possible.
- `Kuromoji.js` - A Japanese morphological analyzer ported to JavaScript that tokenizes each word in a paragraph into their own morphemes, which are formatted as JSON objects. See Kuromoji's [GitHub Repo](https://github.com/takuyaa/kuromoji.js) for more details. 
  - `Kuromojin` is a `Kuromoji.js` wrapper that could be migrated to for several benefits: `readonly` tokens, quicker tokenization thanks to caching that avoids duplicate calls, and even easier implementation. But these benefits don't outweigh migrating from the plain `Kuromoji.js` implementation just yet.

## Project Directory Structure

- `/root`
  - `/client` - Front-end code, Vite server config.
    - `/src`
      - `/features` - Holds collections of React components needed by a feature of the website.
        - `/auth` - Formats the layout and authorization pages like signup, login, and a settings page. 
        - `/reading` - Sets up the pages for customizing the prompt to create a Japanese reading, make an API request to generate the reading, and then route to the page that displays the reading.
      - `/utils` - TypeScript function libraries that may need to be used across the front-end.
  - `/server` - Back-end code, establishes the Express server and routes to code procedures.
    - `/controllers` - Handles server requests like an MVC controller would.
    - `/middleware` - Code needed for validating or blocking a server request.
    - `/models` - Mongoose schemas that model the structure of a MongoDB collection's documents.
    - `/routes` - Sets up routes and routers for all implemented back-end requests.
    - `/scripts` - Holds code that is intended to perform one-off tasks, like adding data to a collection in the MongoDB.
    - `/services` - Holds code files that perform various back-end services.
      - `/ai` - Contains code that helps modularize a prompt to ChatGPT's `4o-mini` model.  
      - `/auth` - Holds functions containing account CRUD operations
      - `/reading` - Holds functions that help retrieve a Japanese paragraph and append english dictionary data to each word.
        - `/constants` -  Contains a map that converts a Kuromoji token's field values to a JMDict code, and sets that store edge-case Japanese verbs to flag.
    - `/tests` - Jest unit tests for `/services` files.
    - `server.js` - Starts up the back-end Express server with CORS middleware, and connects to the MongoDB with `mongoose`.

## API Overview

### /auth sub-routes (authRouter.js)

- POST /users -> Creates a new user
- POST /sessions -> Login and creates JWT
- DELETE /users/:id -> Removes a user (JWT authorization required)

### /decks sub-routes (flashcardRouter.js)

- GET /decks -> Retrieves all of a user's flashcard decks, populating each deck with flashcards tied to the deck's MongoDB objectId.
- POST /decks -> Creates a new flashcard deck.
- GET /decks/:deckId -> Retrieves one flashcard deck given its MongoDB objectId, held in `:deckId`
- PUT /decks/:deckId -> Updates a deck's name and/or description.
- DELETE /decks/:deckId -> Deletes a deck. (And eventually will also cascade delete the flashcards tied to it, too.)


- POST /decks/:deckid/flashcards -> Adds a new flashcard to a deck.
- PUT /decks/:deckId/flashcards/:flashcardId -> Updates a flashcard's front and/or back contents. (May or may not also be used to move the flashcard between decks...?)
- DELETE /decks/:deckId/flashcards/:flashcardId -> Deletes a flashcard entirely.

### /reading sub-routes (readingRouter.js)

- POST /setupReading -> Retrieves results of the setupReading pipeline function

## Setup Instructions

Clone the repo and install dependencies:

```bash
  git clone https://github.com/gwitcig2/Japanese-Practice-Website.git
  npm install
```

Make your own `.env` variables if you don't have the real file:

```env
NODE_ENV=
SERVER_PORT=
VITE_CLIENT_PORT=
JWT_KEY=
VITE_API_READING=(routes to the request for the setupReading pipeline)
CLIENT_ORIGIN=
MONGO_URI=
```
Then run the project with just one command (starts up Vite and the Express server):

```bash
  npm run dev
```

Or run some specific unit tests with just one command:
```bash
  npm test -- /server/tests/*.test.js
```

## Copyright Resources

### The Japanese Multilingual Dictionary (JMDict)

Property of the [Electronic Dictionary Research and Development Group](https://www.edrdg.org/) and used in compliance with their [license](https://www.edrdg.org/edrdg/licence.html).