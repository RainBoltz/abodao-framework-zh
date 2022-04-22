const {
  getDeployedAboPool,
  hasEnoughPoolShares
} = require('../utils')

const owner = process.env.ABOPOOL_KEEPER_WITHDRAW_OWNER !== '' ? process.env.ABOPOOL_KEEPER_WITHDRAW_OWNER : undefined
const shares = process.env.ABOPOOL_KEEPER_WITHDRAW_SHARES !== '' ? process.env.ABOPOOL_KEEPER_WITHDRAW_SHARES : undefined


async function main() {

  // Make sure everything is compiled
  await run('compile')

  const pool = await getDeployedAboPool()
  if (pool === undefined) {
    return
  }

  if (!await hasEnoughPoolShares(pool, owner, shares)) {
    console.log("The owner of the tokens doesn't have enough shares")
    return
  }

  try {
    console.log('owner : ', owner, ', shares : ', shares)
    console.log('withdrawal ...')
    await pool.keeperWithdraw(shares, owner)
    console.log('Withdrawal was successful')
  } catch (error) {
    console.error('Withdrawal failed. Make sure that you are actually a keeper')
    console.error(error)
  }

  console.log(`About the contract, see: https://polygonscan.com/address/${process.env.ABOPOOL}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })