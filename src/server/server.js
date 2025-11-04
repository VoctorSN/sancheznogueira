import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log("Conectado a la database BBDD"))
    .catch((err) => console.log("Could not connect to MongoDB", err));

app.listen(PORT, () => {
    console.log("Server Express running on port: " + PORT);
})
