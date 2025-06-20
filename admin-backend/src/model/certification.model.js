import mongoose from "mongoose";


const certificationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    issurer: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
})

export const Certification = mongoose.model("Certification", certificationSchema);
