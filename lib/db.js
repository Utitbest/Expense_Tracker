// export const runtime = "nodejs";
// import mongoose from "mongoose";

// export async function DBConnect() {
//     try {
//         if (mongoose.connection.readyState >= 1) {
//             console.log("Already connected to MongoDB");
//             return;
//         }

//         await mongoose.connect(process.env.MONGODB_URI, {
//             serverSelectionTimeoutMS: 10000,
//             socketTimeoutMS: 45000,
//             family: 4 
//         });
        
//         console.log("Connected to MongoDB:", mongoose.connection.name);
//     } catch (error) {
//         console.error("MongoDB connection error:", error);
//         throw new Error("Failed to connect to MongoDB");
//     }
// }
export const runtime = "nodejs";
import mongoose from "mongoose";

export async function DBConnect() {
    try {
        if (mongoose.connection.readyState >= 1) {
            console.log("Already connected to MongoDB");
            return;
        }

        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }

        await mongoose.connect(process.env.MONGODB_URI);
        
        console.log("✅ Connected to MongoDB:", mongoose.connection.name);
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        throw new Error(`Failed to connect to MongoDB: ${error.message}`);
    }
}