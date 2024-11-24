async function main() {
  // Time to send our token to the moon 🚀
  console.log("Preparing for launch...")
  
  const Token = await ethers.getContractFactory("Token")
  
  // Deploy with more zeros than a tech startup valuation
  const token = await Token.deploy(
      'Lambo Moon Trillionaire', 
      'LMT',
      '1000000000000'
  )
  
  await token.deployed()
  console.log(`🌕 Houston, we have deployment at: ${token.address}`)
  console.log("Time to check OpenSea for that sweet verification badge...")
}

main().catch((error) => {
  console.error("Houston, we have a problem:", error);
  process.exitCode = 1;
});