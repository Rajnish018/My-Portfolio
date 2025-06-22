import mongoose from "mongoose";
import { Skill } from "./skill.model.js";



const projectSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    githubLink: {
        type: String,
        required: true,
    },
    liveLink: {
        type: String,
        required: true,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Skill"
    },
    technologies: {
        type: [String],
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isArchived: {
        type: Boolean,
        default: false,
    },
},{timestamps: true});

export const Project = mongoose.model("Project", projectSchema);