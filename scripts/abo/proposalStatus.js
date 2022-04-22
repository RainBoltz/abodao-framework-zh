const { getDeployedAboDAO } = require('../utils')

const proposal = process.env.ABODAO_PROPOSAL_STATUS_PROPOSAL !== '' ? process.env.ABODAO_PROPOSAL_STATUS_PROPOSAL : undefined
const sender = process.env.SUMMONER !== '' ? process.env.SUMMONER : undefined

async function main() {

    // Make sure everything is compiled
    await run('compile')

    const abodao = await getDeployedAboDAO()
    if (abodao === undefined) {
        return
    }
    console.log("proposal : ", proposal)
    const status = await abodao.proposalQueue(proposal)
    console.log("proposal status : ", status)

    const vote = await abodao.getMemberProposalVote(sender, proposal)
    console.log('')
    console.log("Your vote (1=yes, 2=no) : ", vote)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })