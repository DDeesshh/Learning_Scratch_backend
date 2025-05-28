import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

import userRoute from "./routes/userRoute.js";
import emailRoute from "./routes/emailRoute.js";

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// routes
app.use("/api/user", userRoute);

// email
app.use("/api/email", emailRoute);

mongoose
  .connect(
    "mongodb+srv://Ellina:ellina5820@cluster0.uounguc.mongodb.net/Scratch_database?retryWrites=true&w=majority&appName=cluster0"
  )
  .then(() => console.log("DB OK"))
  .catch(err => console.log("BD error", err));

app.listen(port, () => {
  console.log(`Is listening on port: ${port}`);
});
