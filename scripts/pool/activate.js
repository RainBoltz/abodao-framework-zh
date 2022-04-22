const {
    getApprovedToken,
    hasEnoughAllowance,
    giveAllowance,
    getDeployedAboPool,
} = require('../utils')

/**
 * Example:
 *     tokens = '10000'; // 0.01 USDT
 *     shares = '100';   // 1 pool share = 0.0001 USDT
 */

const tokens = process.env.ABOPOOL_ACTIVATE_TOKENS !== '' ? process.env.ABOPOOL_ACTIVATE_TOKENS : undefined
const shares = process.env.ABOPOOL_ACTIVATE_SHARES !== '' ? process.env.ABOPOOL_ACTIVATE_SHARES : undefined

async function main() {

    // Make sure everything is compiled
    await run('compile')

    const pool = await getDeployedAboPool()

    const token = await getApprovedToken()
    if (token == undefined) {
        return
    }
    const sender = process.env.SUMMONER

    if (!await hasEnoughAllowance(token, sender, pool, tokens)) {
        await giveAllowance(token, sender, pool, tokens)
    }

    console.log('tokens: ', tokens, ', shares: ', shares)
    console.log('activate ...')
    const tx = await pool.activate(tokens, shares)
    await tx.wait()

    console.log(`The pool is now active.`)
    console.log(`About the contract, see: https://polygonscan.com/address/${process.env.ABOPOOL}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })