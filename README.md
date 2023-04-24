# Crypto exchange deposit Transaction collector

This Node.js script collects crypto transactions that are deposits to major exchanges

## Installation

To install the required dependencies for this script, run the following command:

```
npm install
```

This will install the necessary Node.js modules specified in the `package.json` file, including `bignumber.js`, `dotenv` and `ethers`.

## Usage

To run the script, use the following command:

```
npm start
```

This will execute the `parser.js` script, which will read the transactions from the top erc_20 tokens, find any exchange deposits and output the results to the `transactions.csv` file.

## Dependencies

This script requires the following Node.js modules:

- `bignumber.js` (version 9.1.1 or later)
- `ethers` (version 6.3.0 or later)
- `dotenv` (version 16.0.3 or later)

These modules are specified in the `package.json` file and will be installed automatically when you run `npm install`.

## Configuration

Add your Eth node RPC url to the .env file.

## License

This script is licensed under the MIT License. See the `LICENSE` file for details.