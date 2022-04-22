const {
    getDeployedAboDAO,
    getApprovedToken,
    hasEnoughTokens,
    hasEnoughAllowance,
    giveAllowance
} = require('../utils')

const sender = process.env.SUMMONER !== '' ? process.env.SUMMONER : undefined
const applicant = process.env.ABODAO_PROPOSAL_SUBMIT_APPLICANT !== '' ? process.env.ABODAO_PROPOSAL_SUBMIT_APPLICANT : undefined
const tribute = process.env.ABODAO_PROPOSAL_SUBMIT_TRIBUTE !== '' ? process.env.ABODAO_PROPOSAL_SUBMIT_TRIBUTE : undefined
const shares = process.env.ABODAO_PROPOSAL_SUBMIT_SHARES !== '' ? process.env.ABODAO_PROPOSAL_SUBMIT_SHARES : undefined
const details = process.env.ABODAO_PROPOSAL_SUBMIT_DETAILS !== '' ? process.env.ABODAO_PROPOSAL_SUBMIT_DETAILS : undefined

async function main() {

    // Make sure everything is compiled
    await run('compile')

    const abodao = await getDeployedAboDAO()
    if (abodao === undefined) {
        return
    }

    const token = await getApprovedToken()
    if (token === undefined) {
        return
    }

    // for sender
    let proposalDeposit = await abodao.proposalDeposit()

    if (applicant === sender) {
        proposalDeposit = proposalDeposit.add(tribute)
    }
    if (!await hasEnoughTokens(token, sender, proposalDeposit)) {
        console.error("You don't have enough tokens to pay the deposit")
        return
    }
    if (!await hasEnoughAllowance(token, sender, abodao, proposalDeposit)) {
        await giveAllowance(token, sender, abodao, proposalDeposit)
    }

    // for applicant
    if (applicant !== sender && tribute > 0) {
        if (!await hasEnoughTokens(token, applicant, tribute)) {
            console.error("The applicant don't have enough tokens to pay the tribute")
            return
        }
        if (!await hasEnoughAllowance(token, applicant, abodao, tribute)) {
            console.error("The applicant don't have enough allowance to pay the tribute")
            return
        }
    }

    console.log('sender : ', sender)
    console.log('applicant : ', applicant)
    console.log('tribute : ', tribute, ', shares :', shares)
    console.log('details : "', details, '"')

    console.log('Submit proposal ...')
    const tx = await abodao.submitProposal(applicant, tribute, shares, details)
    await tx.wait()
    console.log('Proposal submitted.')
    console.log(`About the contract, see: https://polygonscan.com/address/${process.env.ABODAO}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })