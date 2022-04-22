const { getDeployedAboDAO, hasEnoughDAOShares } = require('../utils')

const shares = process.env.ABODAO_RAGEQUIT_SHARES !== '' ? process.env.ABODAO_RAGEQUIT_SHARES : undefined
const sender = process.env.SUMMONER !== '' ? process.env.SUMMONER : undefined

async function main() {

    // Make sure everything is compiled
    await run('compile')

    const abodao = await getDeployedAboDAO()
    if (abodao === undefined) {
        return
    }

    if (!await hasEnoughDAOShares(abodao, sender, shares)) {
        console.log("You doesn't have enough DAO shares")
        return
    }

    console.log(`burning shares : ${shares}`)
    console.log(`ragequit ...`)
    const tx = await abodao.ragequit(shares)
    await tx.wait();
    console.log(`Burn ${shares} shares`)
    console.log(`About the contract, see: https://polygonscan.com/address/${process.env.ABODAO}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })