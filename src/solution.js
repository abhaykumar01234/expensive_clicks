const fs = require("fs");
const clickData = require("../input/clicks.json");
const { getExpensiveClicks } = require("./algorithm");

const resultSet = getExpensiveClicks(clickData);

console.log("resultSet", resultSet);

fs.writeFile("./output/resultset.json", JSON.stringify(resultSet), (error) => {
  if (!error) {
    console.log("output saved in ouput folder");
  } else {
    throw error;
  }
});
