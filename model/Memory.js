import mongoose from "mongoose";

const MemorySchema = new mongoose.Schema(
    {
        thumbnail: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const Memory = mongoose.model("Memory", MemorySchema);

export default Memory;
