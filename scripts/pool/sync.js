const { getDeployedAboPool } = require('../utils')

const proposalIndex = process.env.ABOPOOL_SYNC_PROPOSAL_INDEX !== '' ? process.env.ABOPOOL_SYNC_PROPOSAL_INDEX : undefined

async function main() {

  // Make sure everything is compiled
  await run('compile')

  const pool = await getDeployedAboPool()
  if (pool === undefined) {
    return
  }
  const proposal = proposalIndex + 1
  await pool.sync(proposal)

  console.log('proposalIndex :', proposalIndex)
  console.log('Syncing ...')
  const index = await pool.currentProposalIndex()

  console.log('Pool synced up to prposal #', index.toString())
  console.log(`About the contract, see: https://polygonscan.com/address/${process.env.ABOPOOL}`)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })