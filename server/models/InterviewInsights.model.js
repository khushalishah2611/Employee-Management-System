import mongoose from 'mongoose'
import { Schema } from "mongoose";


const InterviewinsightSchema = new Schema({
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Applicant"
    },
    feedback: {
        type: String,
    },
    interviewer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "HumanResources"
    },
    interviewdate: {
        type: Date,
    },
    responsedate: {
        type: Date,
    },
    status: {
        type: String,
        required: true,
        enum: ["Pending", "Canceled", "Completed"],
        default: "Pending"
    },
    organizationID: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const Interviewinsight = mongoose.model("Interviewinsight", InterviewinsightSchema)