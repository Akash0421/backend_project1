
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const env = require("dotenv");
env.config();
const userRouters = require("./routes/userRoutes")
const jobRouters = require("./routes/jobRouters")

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/api/user",userRouters);
app.use("/api/job",jobRouters);

app.get("/", (req,res) => {
    res.send("Hello World!");
})



const PORT =  process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((err) => {
            console.log("Database connection error:", err);
     });
})

