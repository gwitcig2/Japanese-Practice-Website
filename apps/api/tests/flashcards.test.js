import request from "supertest";
import mongoose from "mongoose";
import app from "../src/server.js";

import Flashcard from "../src/models/Flashcard.js";
import FlashcardDeck from "../src/models/FlashcardDeck.js";
import User from "../src/models/User.js";
import { beforeAll, afterAll, describe, expect, test } from "vitest";

const testUser = {
    email: "flashcardWizard@example.com",
    username: "greatestCardDealer",
    password: "GoRamsMan!",
};

let jwtToken;
let dbUser;
let testDeck;

afterAll(async () => {

    if (testDeck) {
        await FlashcardDeck.findByIdAndDelete(testDeck._id);
    }

    if (dbUser) {
        await User.findByIdAndDelete(dbUser._id);
    }

    await mongoose.disconnect();

});

describe("Flashcard routes", () => {

    // making an authorized test user
    beforeAll(async () => {

        await request(app)
            .post("/users")
            .send(testUser)
            .expect(201);

        dbUser = await User.findOne({ username: testUser.username });

        const loginRes = await request(app)
            .post("/sessions")
            .send({
                identifier: testUser.username,
                password: testUser.password,
            })
            .expect(200);

        jwtToken = loginRes.body.accessToken;

    });

    test("POST /decks makes a test flashcard deck", async () => {

        const deckRes = await request(app)
            .post("/decks")
            .set("Authorization", `Bearer ${jwtToken}`)
            .send({ name: "Test Deck" })
            .expect(201);

        testDeck = deckRes.body;

    });

    test("POST /decks/:deckId/flashcards creates a flashcard in the test deck", async () => {

        const res = await request(app)
            .post(`/decks/${testDeck._id}/flashcards`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send({
                front: "犬",
                back: "dog"
            })
            .expect(201);

        expect(res.body).toHaveProperty("_id");
        expect(res.body.front).toBe("犬");
        expect(res.body.back).toBe("dog");

    });

    test("GET /decks/:deckId retrieves all flashcards from the test deck", async () => {

        const res = await request(app)
            .get(`/decks/${testDeck._id}`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(200);

        expect(Array.isArray(res.body.flashcards)).toBe(true);
        expect(res.body.flashcards.length).toBeGreaterThan(0);

        const flashcard = res.body.flashcards[0];

        expect(flashcard.front).toBe("犬");
        expect(flashcard.back).toBe("dog");

    });

    test("PUT /decks/:deckId adds a description to the test deck", async () => {

        const res = await request(app)
            .put(`/decks/${testDeck._id}`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send({ description: "This is, perhaps, one of the greatest flashcard decks I've ever made." })
            .expect(200);

        expect(res.body.description).toBe("This is, perhaps, one of the greatest flashcard decks I've ever made.");

    });

    test("PUT /decks/:deckId/flashcards/:flashcardId updates the back of the flashcard in the test deck", async () => {

        const flashcards = await Flashcard.find({ deck: testDeck._id });
        const flashcardId = flashcards[0]._id;

        const res = await request(app)
            .put(`/decks/${testDeck._id}/flashcards/${flashcardId}`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send({ back: "DOGE!" })
            .expect(200);

        expect(res.body.back).toBe("DOGE!");

    });

    test("DELETE /decks/:deckId/flashcards/:flashcardId removes the flashcard in the test deck", async () => {

        const flashcards = await Flashcard.find({ deck: testDeck._id });
        const flashcardId = flashcards[0]._id;

        const res = await request(app)
            .delete(`/decks/${testDeck._id}/flashcards/${flashcardId}`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(200);

        expect(res.body).toHaveProperty("message", "Flashcard deleted successfully.");

    });

    test("DELETE /decks/:deckId removes the test deck", async () => {

        const res = await request(app)
            .delete(`/decks/${testDeck._id}`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(200);

        expect(res.body).toHaveProperty("message", "Flashcard deck and its flashcards deleted.");

    });

    test("GET /decks/:deckId confirms the deck is removed via returning a 404 code", async () => {

        const res = await request(app)
            .get(`/decks/${testDeck._id}`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(404);

        expect(res.body).toHaveProperty("error", "Deck not found.");

    });

});