import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());



app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.listen(3001, () => {
    console.log("Server is running on port 3001");
});