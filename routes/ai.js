const express = require("express");
const router = express.Router();

const { GoogleGenAI } = require("@google/genai");
const Listing = require("../models/listing");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// AI page
router.get("/", (req, res) => {
    res.render("ai");
});


// AI chat
router.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                error: "Message is required"
            });
        }

        // Get listings from MongoDB
        const listings = await Listing.find({})
            .select("title description price location country category")
            .lean();

        // Convert listings into text for Gemini
        const listingData = listings.map((listing) => ({
            id: listing._id,
            title: listing.title,
            description: listing.description,
            price: listing.price,
            location: listing.location,
            country: listing.country,
            category: listing.category
        }));

        const prompt = `
You are an AI travel assistant for an Airbnb-like website.

The user is looking for accommodation.

User request:
"${message}"

Here are the available listings from our database:

${JSON.stringify(listingData, null, 2)}

Your job:
1. Understand what the user wants.
2. Recommend the most suitable listings from the provided database.
3. Do NOT invent listings that are not present in the database.
4. Consider location, country, category, price and description.
5. If no listing matches well, clearly say that.
6. Give a helpful and concise response.
7. Mention the listing title and price when recommending a listing.

Answer in a friendly travel-assistant style.
`;

       const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt
});
        res.json({
            reply: response.text
        });

    } catch (error) {
        console.error("Gemini Error:", error);

        res.status(500).json({
            error: "AI service failed"
        });
    }
});


module.exports = router;