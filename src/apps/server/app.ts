import express, { json } from "express";
import { suggestNextWord } from "./handlers/suggest.js";
import { queryDocuments } from "./handlers/queryDocuments.js";

const app = express();

app.use('/client', express.static('./client'));

app.get('/guess', suggestNextWord);
app.post('/query', json(), queryDocuments);

export default app;
