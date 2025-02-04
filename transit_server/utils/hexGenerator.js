// utils/hexGenerator.js
function generateHexCode() {
    return [...Array(4)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("");
  }
  
  module.exports = generateHexCode;
  