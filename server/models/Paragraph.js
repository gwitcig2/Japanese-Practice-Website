import mongoose from "mongoose";

const paragraphSchema = new mongoose.Schema({
    /**
     * Unique Japanese paragraph. Should be anywhere between 3 to 8 sentences long.
     * Used for testing the setupReading pipeline and the front-end construction.
     *
     */
    paragraph: { type: String, required: true, unique: true },

    /**
     * JLPT level of the paragraph.
     */
    level: { type: String, required: true },
});

const Paragraph = mongoose.model("Paragraph", paragraphSchema);
export default Paragraph;