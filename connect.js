const mongoose = require("mongoose");

function connectToMongoose(link) {
  mongoose
    .connect(link)
    .then(() => console.log("Successfully Connected to DataBase"))
    .catch((err) => {
      console.log("Error: ", err);
    });
}

module.exports = {connectToMongoose};
