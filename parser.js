// Regular expression pattern to match Ethereum address and name
const pattern = /address\/(0x[a-fA-F0-9]{40}).*?>(.+?)<\/td><td class="sorting_1">(.+?)<\/td>/;
const addresses = require("./raw_data/addresses.js")
const tokens = require("./raw_data/500cryptos")

/**
 * Extracts the Ethereum address and name from a table row using a regular expression
 * and returns an object with key "name" and value "address".
 *
 * @param {string} row - The HTML table row.
 * @returns {object} The object with key "name" and value "address".
 */
function extractEthereumAddressAndNameFromTableRow(row) {
  // Match the Ethereum address and name using the regular expression pattern
  const match = row.match(pattern);

  // Extract the matching groups into an object with key "name" and value "address"
  if (match)
    return {
        name: match[3].trim(),
        address: match[1].trim()
    };
}

// Object.values(addresses).forEach(exchange => {

//     const rows = exchange.split('<tr');

//     rows.forEach(row => {
//         const ethereumAddressAndName = extractEthereumAddressAndNameFromTableRow(row);
//         console.log(ethereumAddressAndName); // { name: 'Binance', address: '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be' }
//     });
    
// });

console.log(tokens)

tokens.data.forEach(token => {
    if (token.platform) {
        if (token.platform.id = 1337) {
            console.log(token.name)
            console.log(token.platform.token_address)
        }
    }
});

