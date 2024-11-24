# LamboMoonTrillionaire Token (LMT)

A tutorial demonstration of creating an ERC-20 token using Hardhat, complete with testing and deployment to Sepolia testnet.

## Description

LamboMoonTrillionaire is an ERC-20 token that showcases:
- Standard ERC-20 implementation
- Professional testing practices
- Deployment and verification on Sepolia testnet

## Contract Details
- Name: LamboMoonTrillionaire
- Symbol: LMT
- Total Supply: 1,000,000,000,000 (1 Trillion)
- Decimals: 18
- Sepolia Contract Address: [0x7A3a9F2c1C3c227Fca57ef9305eaa04Ac56F3E67](https://sepolia.etherscan.io/address/0x7A3a9F2c1C3c227Fca57ef9305eaa04Ac56F3E67)

## Technology Stack
- Solidity
- Hardhat
- Ethers.js
- Chai (testing)

## Setup

```bash
# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy locally
npx hardhat run scripts/deploy.js

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

## Testing

The contract includes comprehensive tests for:
- Token deployment
- Transfer functionality
- Approval system
- Delegated transfers

Run tests with:
```bash
npx hardhat test
```

## Environment Variables

Create a `.env` file with:
```
ALCHEMY_API_KEY=your_alchemy_key
PRIVATE_KEYS=your_private_key
ETHERSCAN_API_KEY=your_etherscan_key
```

## License

This project is licensed under the UNLICENSED license.

## Disclaimer

This token is created for educational purposes only. Not financial advice.