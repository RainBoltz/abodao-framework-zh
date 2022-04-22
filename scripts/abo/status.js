const hre = require("hardhat")
const { getDeployedAboDAO } = require('../utils')

async function main() {

    // Make sure everything is compiled
    await run('compile')

    const abodao = await getDeployedAboDAO()
    if (abodao === undefined) {
        return
    }

    const sender = process.env.SUMMONER

    const processingReward = await abodao.processingReward()
    console.log("processingReward : ", processingReward.toString())

    const currentPeriod = await abodao.getCurrentPeriod()
    console.log("currentPeriod : ", currentPeriod.toString())

    const member = await abodao.members(sender)
    console.log("member : ", sender)
    console.log("member delegateKey : ", member.delegateKey.toString())
    console.log("member shares : ", member.shares.toString())
    console.log("member exists : ", member.exists.toString())
    console.log("member highestIndexYesVote : ", member.highestIndexYesVote.toString())

    const totalSharesRequested = await abodao.totalSharesRequested()
    console.log("totalSharesRequested : ", totalSharesRequested.toString())

    const totalShares = await abodao.totalShares()
    console.log("totalShares : ", totalShares.toString())

    const gracePeriod = await abodao.gracePeriodLength()
    console.log("gracePeriod : ", gracePeriod.toString())

    const abortWindow = await abodao.abortWindow()
    console.log("abortWindow : ", abortWindow.toString())

    const proposalQueueLength = await abodao.getProposalQueueLength()
    console.log("proposalQueueLength : ", proposalQueueLength.toString())

    const summoningTime = await abodao.summoningTime()
    console.log("summoningTime : ", summoningTime.toString())

    const votingPeriodLength = await abodao.votingPeriodLength()
    console.log("votingPeriodLength : ", votingPeriodLength.toString())

    const proposalDeposit = await abodao.proposalDeposit()
    console.log("proposalDeposit : ", proposalDeposit.toString())

    const aboBank = await abodao.aboBank()
    console.log("aboBank : ", aboBank)

    const dilutionBound = await abodao.dilutionBound()
    console.log("dilutionBound : ", dilutionBound.toString())

    const periodDuration = await abodao.periodDuration()
    console.log("periodDuration : ", periodDuration.toString())

    const approvedToken = await abodao.approvedToken()
    console.log("approvedToken : ", approvedToken)
    console.log(`About the contract, see: https://polygonscan.com/address/${process.env.ABODAO}`)

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })