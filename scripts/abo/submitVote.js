const { getDeployedAboDAO } = require('../utils')

const proposal = process.env.ABODAO_VOTE_PROPOSAL  !== '' ? process.env.ABODAO_VOTE_PROPOSAL : undefined
const vote = process.env.ABODAO_VOTE_OPTION  !== '' ? process.env.ABODAO_VOTE_OPTION : undefined

async function main() {

    // Make sure everything is compiled
    await run('compile')

    const abodao = await getDeployedAboDAO()
    if (abodao === undefined) {
      return
    }

    if (vote.toLowerCase() !== 'yes' && vote.toLowerCase() !== 'no') {
      console.error('Invalid vote. It must be "yes" or "no".')
      return
    }
    const voteNumber = vote.toLowerCase() === 'yes' ? 1 : 2
    
    console.log('proposal: ', proposal)
    console.log('vote: ', vote, ', vote number :', voteNumber)

    console.log('Submit vote ...')
    const tx = await abodao.submitVote(proposal, voteNumber)
    await tx.wait()
    console.log('Vote submitted')
    console.log(`About the contract, see: https://polygonscan.com/address/${process.env.ABODAO}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })