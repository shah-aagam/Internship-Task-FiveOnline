import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import mongoose from "mongoose"
import userRoutes from "./routes/userRoute.js"

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
}));


app.use("/api", userRoutes);
  

mongoose.connect(process.env.DATABASE_URL, {
}).then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB Connection Error:", err));


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
  