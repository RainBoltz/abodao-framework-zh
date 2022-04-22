const hre = require("hardhat")

async function main() {

    if (process.env.SUMMONER === '' || process.env.APPROVED_TOKEN === '') {
        console.error('Please set the deployment parameters in deployment-params.js')
        return
    }

    // Make sure everything is compiled
    await run('compile')

    console.log('Deploying a new AboDAO to the network ' + config.defaultNetwork)
    console.log(
        'Deployment parameters:\n',
        '  summoner:', process.env.SUMMONER, '\n',
        '  token:', process.env.APPROVED_TOKEN, '\n',
        '  periodSeconds:', process.env.PERIOD_DURATION_IN_SECONDS, '\n',
        '  votingPeriods:', process.env.VOTING_DURATON_IN_PERIODS, '\n',
        '  gracePeriods:', process.env.GRACE_DURATON_IN_PERIODS, '\n',
        '  abortPeriods:', process.env.ABORT_WINDOW_IN_PERIODS, '\n',
        '  proposalDeposit:', process.env.PROPOSAL_DEPOSIT, '\n',
        '  dilutionBound:', process.env.DILUTION_BOUND, '\n',
        '  processingReward:', process.env.PROCESSING_REWARD, '\n'
    )

    const Confirm = require('prompt-confirm')
    const prompt = new Confirm('Please confirm that the deployment parameters are correct')
    const confirmation = await prompt.run()

    if (!confirmation) {
        return
    }

    const AboDAO = await hre.ethers.getContractFactory("AboDAO")

    console.log("Deploying...")

    const abodao = await AboDAO.deploy(
        process.env.SUMMONER,
        process.env.APPROVED_TOKEN,
        process.env.PERIOD_DURATION_IN_SECONDS,
        process.env.VOTING_DURATON_IN_PERIODS,
        process.env.GRACE_DURATON_IN_PERIODS,
        process.env.ABORT_WINDOW_IN_PERIODS,
        process.env.PROPOSAL_DEPOSIT,
        process.env.DILUTION_BOUND,
        process.env.PROCESSING_REWARD
    )

    console.log('AboDAO deployed. Address:', abodao.address)
    console.log("Set this address in .env: ABODAO")
    console.log(`About the contract, see: https://polygonscan.com/address/${process.env.ABODAO}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })