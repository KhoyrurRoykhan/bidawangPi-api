import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./routes/routes.js";
import Database from "./config/Database.js";
import Users from "./models/UserModel.js";
import Guru from "./models/GuruModel.js";
import Nilai from "./models/NilaiModel.js";

dotenv.config();
const app = express();

try {
    await Database.authenticate();
    console.log('Database Connected...');
    await Users.sync();
    await Guru.sync();
    await Nilai.sync();
} catch (error) {
    console.error(error);
}

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));
app.use(routes);

const PORT = process.env.PORT
app.listen(PORT, ()=> console.log(`Server up and running ${PORT}...`));