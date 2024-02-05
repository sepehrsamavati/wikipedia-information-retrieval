import express from "express";
import { suggestNextWord } from "./handlers/suggest.js";

const app = express();

app.get('/guess', suggestNextWord);

export default app;
