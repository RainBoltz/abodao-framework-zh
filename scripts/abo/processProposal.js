const { getDeployedAboDAO } = require('../utils')

const proposal = process.env.ABODAO_PROCESS_PROPOSAL_INDEX !== '' ? process.env.ABODAO_PROCESS_PROPOSAL_INDEX : undefined

async function main() {

    // Make sure everything is compiled
    await run('compile')

    const abodao = await getDeployedAboDAO()
    if (abodao === undefined) {
        return
    }
    console.log('process proposal', proposal, '...')
    const tx = await abodao.processProposal(proposal)
    await tx.wait()
    console.log('Proposal processed.')
    console.log(`About the contract, see: https://polygonscan.com/address/${process.env.ABODAO}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })