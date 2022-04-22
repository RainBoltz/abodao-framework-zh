const { getDeployedAboPool, getApprovedToken } = require('../utils')
const sender = process.env.SUMMONER  !== '' ? process.env.SUMMONER : undefined

async function main() {

    // Make sure everything is compiled
    await run('compile')

    const aboPool = await getDeployedAboPool()
    if (aboPool === undefined) {
        return
    }

    const token = await getApprovedToken()
    if (token === undefined) {
        return
    }

    const currentProposalIndex = await aboPool.currentProposalIndex()
    console.log("currentProposalIndex : ", currentProposalIndex.toString())

    const approvedToken = await aboPool.approvedToken()
    console.log("approvedToken : ", approvedToken)

    const balance = await token.balanceOf(aboPool.address);
    console.log("Total balance : ", balance.toString())

    const donors = await aboPool.donors(sender)
    console.log("Your shares : ", donors.toString())    

    const abodao = await aboPool.abodao()
    console.log("abodao : ", abodao)

    console.log(`About the contract, see: https://polygonscan.com/address/${process.env.ABOPOOL}`)

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })