const { getDeployedAboDAO} = require('../utils')

const delegate = process.env.ABODAO_UPDATE_DELEGATE !== '' ? process.env.ABODAO_UPDATE_DELEGATE : undefined

async function main() {

    // Make sure everything is compiled
    await run('compile')

    const abodao = await getDeployedAboDAO()
    if (abodao === undefined) {
        return
    }
    console.log(`Update delegate ...`)
    const tx = await abodao.updateDelegateKey(delegate)
    await tx.wait()
    console.log(`Delegate updated`)
    console.log(`About the contract, see: https://polygonscan.com/address/${process.env.ABODAO}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })