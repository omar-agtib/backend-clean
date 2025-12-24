const { getIO } = require("./index");

function stockUpdated(stockItem) {
  getIO().emit("stock:updated", stockItem);
}

module.exports = {
  stockUpdated,
};
