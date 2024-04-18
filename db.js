const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/internship", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

module.exports = mongoose.connection;
