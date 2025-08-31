import mongoose from "mongoose";

const paragraphSchema = new mongoose.Schema({
    paragraph: { type: String, required: true, unique: true },
    level: { type: String, required: true },
});

const Paragraph = mongoose.model("Paragraph", paragraphSchema);
export default Paragraph;