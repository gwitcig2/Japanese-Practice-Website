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
- [Personal Motivation](#personal-motivation)
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

- `React & TailwindCSS` - No-brainers for building a sleek, snappy, and fully customized single-page user interface.
- `TypeScript` - Used solely in the client-side so that error-checking and code readability are enhanced, making prototyping with Vite's Hot Module Replacement as comprehensive as possible.
- `JavaScript` - Used primarily in the server-side to avoid over-complicating function pipelines with custom types. Also avoids mis-representing data returned by pure-JavaScript libraries. 
  - Migrating server-side files to TypeScript may occur if code-readability and/or error-checking become too tedious.
- `MongoDB` - Currently hosted on an Atlas free plan. Stores the JMDict formatted in JSON due to its size (~100MB). Also stores a collection of AI-generated Japanese paragraphs organized by JLPT level. Will eventually store simple user data like their readings and their flashcard decks.
- `Mongoose` - ODM used in the server-side to retrieve to randomly select from collection of Japanese paragraphs and to batch-query JMDict for the English definitions of an array of Japanese words. 
- `Express` - Sets up routing for HTTP requests and establishes CORS middleware for the server. 
  - `Next.js` may be migrated to in the future for benefits like rendering React components server-side and having `NextAuth.js` for easy user authentication. Though this would require a hefty refactor of the project's directory structure.
- `Node.js` - No-brainer server runtime for the pure JavaScript libraries that make this website possible.
- `Kuromoji.js` - A Japanese morphological analyzer ported to JavaScript that tokenizes each word in a paragraph into their own morphemes, which are formatted as JSON objects. See Kuromoji's [GitHub Repo](https://github.com/takuyaa/kuromoji.js) for more details. 
  - `Kuromojin` is a `Kuromoji.js` wrapper that could be migrated to for several benefits: `readonly` tokens, quicker tokenization thanks to caching that avoids duplicate calls, and even easier implementation. But there's no immediate reason to have these benefits over plain `Kuromoji.js` just yet.

## Project Directory Structure

- `/root`
  - `/client` - Front-end code, Vite server config.
    - `/src`
      - `/readingComponents` - React components for the "Reading" section of the webpage.
      - `/utils` - TypeScript function libraries that may need to be used across the front-end.
  - `/server` - Back-end code, establishes the Express server and routes to code procedures.
    - `/constants` - Currently holds exported sets that are relied upon in various `/services` files for handling edge cases.
    - `/models` - Files that model the structure of collections in the website's MongoDB for `mongoose`.
    - `/procedures` - Files for creating the `main()`-like function that brings the necessary `/services` together to perform one task. 
    - `/routes` - Sets up the POST call to a procedure in `/procedures`.
    - `/scripts` - Holds code that is intended to perform one-off tasks, like adding data to a collection in the MongoDB.
    - `/services` - Files of function libraries necessary to create an organized procedure in `/procedures`.
    - `/tests` - Unit tests for `/services` files and `/procedures` files, written with Jest.
    - `server.js` - Starts up the back-end Express server with CORS middleware, and connects to the MongoDB with `mongoose`.

## Copyright Resources

### The Japanese Multilingual Dictionary (JMDict)

Property of the [Electronic Dictionary Research and Development Group](https://www.edrdg.org/) and used in compliance with their [license](https://www.edrdg.org/edrdg/licence.html).