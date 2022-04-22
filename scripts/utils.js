const hre = require("hardhat")
const { web3 } = require("hardhat")


// These functions are meant to be run from tasks, so the
// BuidlerRuntimeEnvironment is available in the global scope.

/**
 * Returns the deployed instance of the AboDAO, or undefined if its
 * address hasn't been set in the config.
 */
async function getDeployedAboDAO() {
  const abodaoAddress = getAboDAOAddress()
  if (!abodaoAddress) {
    console.error(`Please, set the DAO's address in .env: ABODAO`)
    return
  }

  const AboDAO= await hre.ethers.getContractFactory('AboDAO')
  return await AboDAO.attach(abodaoAddress)
}

/**
 * Returns the deployed instance of the AboPool contract, or undefined if its
 * address hasn't been set in the config.
 */
async function getDeployedAboPool() {
  const poolAddress = getPoolAddress()
  if (!poolAddress) {
    console.error(`Please, set the Pool's address in .env: ABOPOOL`)
    return
  }

  const Pool = await hre.ethers.getContractFactory('AboPool')
  return Pool.attach(poolAddress)
}

/**
 * Returns the deployed instance of the AboDAO's approved token, or
 * undefined if the DAO's address hasn't been set in the config.
 */
async function getApprovedToken() {
  const abodao = await getDeployedAboDAO()
  if (abodao === undefined) {
    return
  }

  const tokenAddress = await abodao.approvedToken()

  return await hre.ethers.getContractAt('IERC20', tokenAddress)
}

/**
 * Returns the address of the AboDAO as set in .env, or undefined if
 * it hasn't been set.
 */
function getAboDAOAddress() {
  return process.env.ABODAO !== '' ? process.env.ABODAO : undefined
}

/**
 * Returns the address of the AboPool as set in .env, or undefined if
 * it hasn't been set.
 */
function getPoolAddress() {
  return process.env.ABOPOOL !== '' ? process.env.ABOPOOL : undefined
}

async function giveAllowance(tokenContract, allowanceGiver, receiverContract, amount) {
  return tokenContract.approve(receiverContract.address, amount, { from: allowanceGiver })
}

async function hasEnoughAllowance(tokenContract, allowanceGiver, receiverContract, amount) {
  const allowance = await tokenContract.allowance(allowanceGiver, receiverContract.address)
  return allowance.gte(amount)
}

async function hasEnoughTokens(tokenContract, tokensOwner, amount) {
  const balance = await tokenContract.balanceOf(tokensOwner)
  console.log('[ hasEnoughTokens ] balance : ', balance.toString())
  console.log('[ hasEnoughTokens ] amount : ', amount.toString())
  return balance.gte(amount)
}

async function hasEnoughPoolShares(pool, owner, amount) {
  const shares = await pool.donors(owner)
  console.log('Your shares : ', shares)
  console.log('Your request amount : ', amount)
  return shares.gte(amount)
}

async function hasEnoughDAOShares(dao, owner, amount) {

  const member = await dao.members(owner)
  const shares = member.shares;
  console.log('Your shares : ', shares.toString())
  console.log('Your request amount : ', amount)
  return shares.gte(amount)
}

module.exports = {
  getDeployedAboDAO,
  getDeployedAboPool,
  getApprovedToken,
  getAboDAOAddress,
  getPoolAddress,
  giveAllowance,
  hasEnoughAllowance,
  hasEnoughTokens,
  hasEnoughPoolShares,
  hasEnoughDAOShares
}
