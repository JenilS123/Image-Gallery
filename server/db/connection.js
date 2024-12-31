const mongoose = require("mongoose");

mongoose.connect(process.env.Mongoose_Connection).then(() => {
    console.log("connected");
}).catch((error) => {
    console.log("connection Error: " + error);
})