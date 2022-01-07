const invoices = require("./invoices.json");
const plays = require("./plays.json");
const statement = require("./statement");

test("statement out right", () => {
  expect(statement(invoices, plays)).toBe(
    "Statement for BigCo\n" +
      " Hamlet: $650.00 (55 seats)\n" +
      " As You Like It: $580.00 (35 seats)\n" +
      " Othello: $500.00 (40 seats)\n" +
      "Amount owed is $1,730.00\n" +
      "You earned 47 credits\n"
  );
});
