// Regular expression pattern to match Ethereum address and name
const pattern = /address\/(0x[a-fA-F0-9]{40}).*?>(.+?)<\/td><td class="sorting_1">(.+?)<\/td>/;
const binanceAddresses = require("./raw_data/binanceAddresses.js")
const coinbaseAddresses = require("./raw_data/coinbaseAddresses.js")
const krakenAddresses = require("./raw_data/krakenAddresses.js")

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

// Example table row
// const row = '<tr role="row" class="odd"><td><a class="me-1" href="/address/0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be" data-bs-toggle="tooltip" data-bs-title="0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be">0x3f5CE5...C936f0bE</a> <a class="js-clipboard link-secondary " href="javascript:;" data-clipboard-text="0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE" data-bs-toggle="tooltip" data-hs-clipboard-options="{ &quot;type&quot;: &quot;tooltip&quot;, &quot;successText&quot;: &quot;Copied!&quot;, &quot;classChangeTarget&quot;: &quot;#linkIcon_0x3f5_1&quot;, &quot;defaultClass&quot;: &quot;fa-copy&quot;, &quot;successClass&quot;: &quot;fa-check&quot; }" aria-label="Copy Address"><i id="linkIcon_0x3f5_1" class="far fa-copy fa-fw"></i> </a></td><td class="sorting_1">Binance</td><td>0<b>.</b>20403752 ETH</td><td>17,017,385</td></tr>';
const rows = krakenAddresses.split('<tr');
// Extract the Ethereum address and name from the table row


console.log(rows[0])

rows.forEach(row => {
    const ethereumAddressAndName = extractEthereumAddressAndNameFromTableRow(row);
    // Log the result
    console.log(ethereumAddressAndName); // { name: 'Binance', address: '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be' }

});
