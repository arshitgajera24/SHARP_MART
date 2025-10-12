import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

const sql = postgres(process.env.DATABASE_URL,{
  ssl: {
    rejectUnauthorized: false
  }
});

export const db = drizzle(sql);
 


// import mongoose from "mongoose"

// export const connectDB = async () => {
//     await mongoose.connect(process.env.MONGODB_URL).then(() => console.log("MongoDB Connected"));
// }
