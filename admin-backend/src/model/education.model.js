    import mongoose from "mongoose";

    const educationSchema = new mongoose.Schema({
        degree:{
            type: String,
            required: true,
        },
        institution: {
            type: String,
            required: true,
        },
        year:{
            type: String,
            required: true,
        },
        achievements: {
            type: [String],
            default: [],
            required: true,
        },
    })


    export const Education = mongoose.model("Education", educationSchema)