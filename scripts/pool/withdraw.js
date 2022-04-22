const {
  getDeployedAboPool,
  hasEnoughPoolShares
} = require('../utils')

const shares = process.env.ABOPOOL_WITHDRAW_SHARES  !== '' ? process.env.ABOPOOL_WITHDRAW_SHARES : undefined
const sender = process.env.SUMMONER  !== '' ? process.env.SUMMONER : undefined

async function main() {

  // Make sure everything is compiled
  await run('compile')

  const pool = await getDeployedAboPool()
  if (pool === undefined) {
    return
  }

  if (!await hasEnoughPoolShares(pool, sender, shares)) {
    console.log("You don't have enough shares")
    return
  }

  console.log('Shares : ',shares)
  console.log('Withdrawal ...')
  const tx = await pool.withdraw(shares)
  await tx.wait()
  console.log('Successful withdrawal')

  console.log(`About the contract, see: https://polygonscan.com/address/${process.env.ABOPOOL}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })