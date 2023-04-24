// Regular expression pattern to match Ethereum address and name
const pattern = /address\/(0x[a-fA-F0-9]{40}).*?>(.+?)<\/td><td class="sorting_1">(.+?)<\/td>/;
const addresses = require("./raw_data/addresses.js")
const tokens = require("./raw_data/500cryptos")
const abi = require("./abi/erc20_usdt")
const fs = require('fs');
const { decimals } = require("./config/tokenConfig")
const BN = require('bignumber.js');
const { ethers } = require("ethers");
const { utcTimeToOnlyDate } = require("./helpers/time")
require('dotenv').config();
const rpc = process.env.RPC

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

const convertTokenToDecimals = (amount, symbol) => {
    const decimal = decimals[symbol]

    if (decimal)
        return new BN(amount).dividedBy(new BN(10**decimal)).toFixed(0)
    else 
        return new BN(amount).dividedBy(new BN(10**18)).toFixed(0)
}

async function getBlockTimestamps(blockNumbers) {
    const blockPromises = blockNumbers.map((blockNumber) => provider.getBlock(blockNumber));
    const blocks = await Promise.all(blockPromises);
    const timestamps = blocks.map((block) => {
      return block ? new Date(block.timestamp * 1000).toUTCString() : null;
    });
    return timestamps;
  }
  
  // Set up provider and contract instance
  const provider = new ethers.getDefaultProvider(rpc);
  const contractAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7"; // just to setup filter
  const contract = new ethers.Contract(contractAddress, abi, provider);
  
  // Set up event filter
  // Todo make event filter tighter to the exchange addresses
  const eventName = "Transfer";
  const eventFilter = contract.filters[eventName]();

  // Time deplay helper
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  
  // Fetch event logs
  async function fetchEventLogs (token) {

    console.log(`Fetching ${token.name}`)

    // Parse all exchange addresses into a big array of [address, name]
    let exchanges = []
    Object.values(addresses).forEach(exchange => {
        const rows = exchange.split('<tr');
        rows.forEach(row => {
            const ethereumAddressAndName = extractEthereumAddressAndNameFromTableRow(row);
            exchanges.push(ethereumAddressAndName)
        }); 
    });
    
    // Fetch logs relative to current block number
    const blockNumber = await provider.getBlockNumber();
    const logs = await provider.getLogs({
      fromBlock: blockNumber - 500,
      toBlock: blockNumber,
      address: token.platform.token_address,
      topics: eventFilter.topics
    });

    // Get all the logs sorted by exchange
    let exchangeLogs = []
    logs.map((log, i) => {
        // Filtering by standard Topic0 transfer. todo, add other different topics
        if (log.topics[0] == '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') { 
            const decodedLog = contract.interface.decodeEventLog(eventName, log.data, log.topics);

            // Take the log and compare it to all echnage addresses
            exchanges.forEach(exchange => {
                if (exchange) {
                    if (decodedLog[1].toLowerCase() == exchange.address.toLowerCase()) {
                        exchangeLogs.push({
                            block_number: log.blockNumber,
                            tx: log.transactionHash,
                            destination_address: exchange.address.toLowerCase(),
                            exchange: exchange.name,
                            token_name: token.name,
                            token_erc20: token.platform.token_address,
                            number_of_coins_transferred: convertTokenToDecimals(decodedLog[2], token.symbol),
                        })
                        return;
                    }
                }
                
            });
            
        }
    });
  
    return exchangeLogs;
  }


// Main function -
// 1. Get all the tokens and loop over them fetching event logs
// 2. Sort the logs by exchange
// 3. Append the date time to each log for convenience
// 4. Write to csv
async function processTokens(tokens) {
  for (const token of tokens.data) {
    // Do something with the token here...
    if (token.platform) {
        if (token.platform.id = 1337) {
            fetchEventLogs(token).then(async (logs, i) => {
                // Get timestamps for all
                let blockNumbers = [];
                logs.forEach(log => {
                    blockNumbers.push(log.block_number)
                });
                
                const blockTimestamps = await getBlockTimestamps(blockNumbers)
                logs.forEach((log, i) => {
                    logs[i]['utc_date_time_of_transfer']= blockTimestamps[i]
                    logs[i]['utc_date_of_transfer']= utcTimeToOnlyDate(blockTimestamps[i])
                    delete logs[i].block_number;
                });

                // append csv
                const csv = logs.map(row => Object.values(row).join(',')).join('\n');
                fs.writeFile('transactions.csv', csv, { flag: 'a' }, (error) => {if (error) console.error(error);});
                if (logs[0]) {
                    console.log(`${logs[0].token_name} complete. \n`)
                } else {
                    console.log(`No logs found for specified time period \n`)
                }
            }).catch((error) => {
                console.error(error);
            }); 
        }
    }

    // Wait for 5 seconds before processing the next token
    await delay(2000);
  }
}

fs.writeFile('transactions.csv', "tx,destination_address,exchange,token_name,token_erc20,number_of_coins_transferred,utc_date_time_of_transfer,utc_date_of_transfer\n", () => {})

processTokens(tokens).then(() => {
  console.log('All tokens processed!');
}).catch((error) => {
  console.error(error);
});


