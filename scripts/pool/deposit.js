const {
    getDeployedAboPool,
    getApprovedToken,
    hasEnoughTokens,
    hasEnoughAllowance,
    giveAllowance
} = require('../utils')

const sender = process.env.SUMMONER  !== '' ? process.env.SUMMONER : undefined
const tokens = process.env.ABOPOOL_DEPOSIT_TOKENS !== '' ? process.env.ABOPOOL_DEPOSIT_TOKENS : undefined

async function main() {

    // Make sure everything is compiled
    await run('compile')

    const pool = await getDeployedAboPool()
    if (pool === undefined) {
        return
    }

    const token = await getApprovedToken()
    if (token == undefined) {
        return
    }

    if (!await hasEnoughTokens(token, sender, tokens)) {
        console.error("You don't have enough tokens")
        return
    }

    if (!await hasEnoughAllowance(token, sender, pool, tokens)) {
        await giveAllowance(token, sender, pool, tokens)
    }

    console.log('deposit ...')
    await pool.deposit(tokens)

    console.log('Tokens deposited.')
    console.log(`About the contract, see: https://polygonscan.com/address/${process.env.ABOPOOL}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })