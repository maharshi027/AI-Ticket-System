import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

app.use(express.json());

mongoose
  .connect(process.env.MOGNO_URI)
  .then(() => {
    console.log("MongoDB connected successfully !");
    app.listen(PORT, () =>
      console.log(`Server is running at Port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.log("MongoDB Error ", err));
