const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const menuRoutes = require('./routes/menuRoutes');
app.use('/', menuRoutes);

// const CONNECTION_URL = "mongodb://localhost:27017/Restaurant";
const CONNECTION_URL = "mongodb+srv://lenin:lenin@restaurant.k2z5wws.mongodb.net/test";

const PORT = 5000;

mongoose.connect(CONNECTION_URL,{useUnifiedTopology:true},{useNewUrlParser:true},{useFindAndModify:true})
        .then(() => {
            app.listen(PORT,()=>{
                console.log(`server is running on port ${PORT}`);
            })
        })
        .catch((error) => {
            console.log(error + "Database connection is failed");
        })


        