const hre = require("hardhat")
const { getDeployedAboDAO, getApprovedToken } = require('../utils')

async function main() {

    // Make sure everything is compiled
    await run('compile')

    const abodao = await getDeployedAboDAO()
    if (abodao === undefined) {
        return
    }

    const token = await getApprovedToken()
    if (token == undefined) {
        return
    }

    console.log('Deploying a new Pool to network ' + config.defaultNetwork)

    console.log(
        'Deployment parameters:\n',
        '  AboDAO:', abodao.address, '\n',
    )

    const Confirm = require('prompt-confirm')
    const prompt = new Confirm('Please confirm that the deployment parameters are correct')
    const confirmation = await prompt.run()

    if (!confirmation) {
        return
    }

    const Pool = await hre.ethers.getContractFactory('AboPool')

    console.log('Deploying...')
    const pool = await Pool.deploy(abodao.address)

    console.log('')
    console.log('Pool deployed. Address:', pool.address)
    console.log('Set this address in .env: ABOPOOL')
    console.log(`About the contract, see: https://polygonscan.com/address/${process.env.ABOPOOL}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })