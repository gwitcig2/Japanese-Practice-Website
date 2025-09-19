import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";
import Flashcard from "../models/Flashcard.js";
import FlashcardDeck from "../models/FlashcardDeck.js";

// TODO: Make unit tests for flashcard operations