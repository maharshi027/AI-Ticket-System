import mongoose, { Schema } from 'mongoose'

const ticketSchema = new Schema({
    title: String,
    description: String,
    status: {type: String, default:"To-Do"}, 
    createdAt: {type:mongoose.Schema.Types.ObjectId, ref:"User"},
    assignedTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default:null
    },
    priority: String,
    deadline: Date,
    helpfulNotes: String ,
    relatedSkills: [String],

}, {timestamps: true}
)

export default mongoose.model("Ticket", ticketSchema);