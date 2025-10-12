import { drizzle } from "drizzle-orm/mysql2";
import dotenv from "dotenv"
dotenv.config();

export const db = drizzle(process.env.DATABASE_URL);

if(db) console.log("MySQL Connected");
 


// import mongoose from "mongoose"

// export const connectDB = async () => {
//     await mongoose.connect(process.env.MONGODB_URL).then(() => console.log("MongoDB Connected"));
// }