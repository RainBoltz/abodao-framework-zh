const { getDeployedAboPool } = require('../utils')

const keeper = process.env.ABOPOOL_ADD_KEEPER !== '' ? process.env.ABOPOOL_ADD_KEEPER : undefined

async function main() {

    // Make sure everything is compiled
    await run('compile')

    const pool = await getDeployedAboPool()
    if (pool === undefined) {
        return
    }
    console.log(`add keeper ${keeper} ...`)
    await pool.addKeepers([keeper])
    console.log(`Keeper added.`)
    console.log(`About the contract, see: https://polygonscan.com/address/${process.env.ABOPOOL}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })