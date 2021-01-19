/**
 *
 * @param {object} obj Intermediate object result updated by reference
 * @param {string} period | A valid time period 00 - 23 for a timestamp hour
 * @param {string} ip | A ip string of format 11.11.11.11
 * @param {string} timestamp | A valid timestamp in format mm/dd/yyyy hh24:MM:ss
 * @param {number} amount | A valid number or decimal value
 *
 * Condition 1 => groups click by ip, period and chooses the most expensive amount
 * Condition 2 => if amount is same, chooses the click with earliest timestamp
 * Condition 3 => stops & returns for IP with click count greater than 10 (reduces unnecessary calculations)
 * updates the reference object op [intermediate object]
 */
function processClick(obj, period, ip, timestamp, amount) {
  // first entry => save the entry
  obj[ip] = obj[ip] || {};

  // if no of clicks for current ip is more than 10
  if (Object.values(obj[ip]).length === 11) return;

  //first entry => save the entry
  if (!obj[ip][period]) obj[ip][period] = { ip, timestamp, amount };
  else {
    // Condition 2 => entry exists, choose more amount
    if (amount > obj[ip][period]["amount"]) {
      //overwrite
      obj[ip][period] = { ip, timestamp, amount };
    } else if (amount === obj[ip][period]["amount"]) {
      // Condition 2 => same amount, choose earliest timestamp
      if (new Date(timestamp) < new Date(obj[ip][period]["timestamp"])) {
        // overwrite
        obj[ip][period] = { ip, timestamp, amount };
      }
    }
  }
}

/**
 *
 * @param {array} arr | clicks.json array of objects => {ip, timestamp, amount}
 * @returns {array} | iterates on each click & returns array of objects
 */
function iterateClicks(arr) {
  const ip_period_entry = {},
    clickResults = [];
  for (let i = 0, len = arr.length; i < len; i++) {
    const click = arr[i];
    if (!click.ip || !click.timestamp || !click.amount) {
      console.log(
        "Invalid click record, must contain keys { ip, timestamp, amount }",
        click
      );
      continue;
    }
    const { ip, timestamp, amount } = click;
    // const period = /\s\d+/.exec(timestamp)[0].trim();
    const period = new Date(timestamp).getHours();

    processClick(ip_period_entry, period, ip, timestamp, amount);
  }

  for (let period_entry of Object.values(ip_period_entry)) {
    // Condition 3 => do not include IPs with more than 10 clicks
    if (Object.values(period_entry).length <= 10) {
      clickResults.push(...Object.values(period_entry));
    }
  }
  return clickResults;
}

module.exports = {
  getExpensiveClicks: iterateClicks,
};
