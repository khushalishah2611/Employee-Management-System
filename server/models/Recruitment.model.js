import mongoose from 'mongoose'
import { Schema } from "mongoose";

const RecruitmentSchema = new Schema({
    jobtitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    },
    application: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Applicant"
        }
    ],
    organizationID: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const Recruitment = mongoose.model('Recruitment', RecruitmentSchema)