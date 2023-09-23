const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose
    .connect(
        "mongodb+srv://mint:mint@corner-store.cbiyacl.mongodb.net/Store?retryWrites=true&w=majority"
    )
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((error) => console.log(error.message));

module.exports = mongoose;