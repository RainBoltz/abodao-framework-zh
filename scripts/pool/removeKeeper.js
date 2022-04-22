const { getDeployedAboPool } = require('../utils')

const keeper = process.env.ABOPOOL_REMOVE_KEEPER !== '' ? process.env.ABOPOOL_REMOVE_KEEPER : undefined

async function main() {

    // Make sure everything is compiled
    await run('compile')

    const pool = await getDeployedAboPool()
    if (pool === undefined) {
        return
    }

    console.log('remove keeper ...')
    await pool.removeKeepers([keeper])
    console.log('Keeper removed')
    console.log(`About the contract, see: https://polygonscan.com/address/${process.env.ABOPOOL}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })