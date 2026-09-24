const crypto = require("crypto");

const generateOrderNumber = () => {
  const time = Date.now().toString().slice(-8);

  const random = crypto.randomBytes(2).toString("hex").toUpperCase();

  return `ARS-${time}-${random}`;
};

const generateTransactionId = () => {
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();

  return `ARS${Date.now()}${random}`;
};

module.exports = {
  generateOrderNumber,
  generateTransactionId,
};
