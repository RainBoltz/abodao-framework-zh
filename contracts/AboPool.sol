// SPDX-License-Identifier: MIT
pragma solidity 0.5.3;

// Pool.sol
// - mints a pool share when someone donates tokens
// - syncs with AboDAOproposal queue to mint shares for grantees
// - allows donors to withdraw tokens at any time


import "./AboDAO.sol";
import "./oz/SafeMath.sol";
import "./oz/IERC20.sol";

contract AboPool {
    using SafeMath for uint256;

    event Sync (
        uint256 currentProposalIndex
    );

    event Deposit (
        address donor,
        uint256 sharesMinted,
        uint256 tokensDeposited
    );

    event Withdraw (
        address donor,
        uint256 sharesBurned
    );

    event KeeperWithdraw (
        address donor,
        uint256 sharesBurned,
        address keeper
    );

    event AddKeepers (
        address donor,
        address[] addedKeepers
    );

    event RemoveKeepers (
        address donor,
        address[] removedKeepers
    );

    event SharesMinted (
        uint256 sharesToMint,
        address recipient,
        uint256 totalPoolShares
    );

    event SharesBurned (
        uint256 sharesToBurn,
        address recipient,
        uint256 totalPoolShares
    );

    uint256 public totalPoolShares = 0; // the total shares outstanding of the pool
    uint256 public currentProposalIndex = 0; // the abodao proposal index that this pool has been synced to

    AboDAO public abodao; // abodao contract reference
    IERC20 public approvedToken; // approved token contract reference (copied from abodao contract)

    bool locked; // prevent re-entrancy

    uint256 constant MAX_NUMBER_OF_SHARES = 10**30; // maximum number of shares that can be minted

    struct Donor {
        uint256 shares;
        mapping (address => bool) keepers;
    }

    // the amount of shares each pool shareholder has
    mapping (address => Donor) public donors;

    modifier active {
        require(totalPoolShares > 0, "AboPool: Not active");
        _;
    }

    modifier noReentrancy() {
        require(!locked, "AboPool: Reentrant call");
        locked = true;
        _;
        locked = false;
    }

    constructor(address _abodao) public {
        abodao = AboDAO(_abodao);
        approvedToken = IERC20(abodao.approvedToken());
    }

    function activate(uint256 initialTokens, uint256 initialPoolShares) public noReentrancy {
        require(totalPoolShares == 0, "AboPool: Already active");

        require(
            approvedToken.transferFrom(msg.sender, address(this), initialTokens),
            "AboPool: Initial tokens transfer failed"
        );
        _mintSharesForAddress(initialPoolShares, msg.sender);
    }

    // updates Pool state based on AboDAOproposal queue
    // - we only want to mint shares for grants, which are 0 tribute
    // - mints pool shares to applicants based on sharesRequested / maxTotalSharesAtYesVote
    // - use maxTotalSharesAtYesVote because:
    //   - cant read shares at the time of proposal processing (womp womp)
    //   - should be close enough if grant shares are small relative to total shares, which they should be
    //   - protects pool contributors if many AboDAOmembers ragequit before the proposal is processed by reducing follow on funding
    //   - e.g. if 50% of AboDAOshares ragequit after someone voted yes, the grant proposal would get 50% less follow-on from the pool
    function sync(uint256 toIndex) public active noReentrancy {
        require(
            toIndex <= abodao.getProposalQueueLength(),
            "AboPool: Proposal index too high"
        );

        // declare proposal params
        address applicant;
        uint256 sharesRequested;
        bool processed;
        bool didPass;
        bool aborted;
        uint256 tokenTribute;

        uint256 i = currentProposalIndex;

        while (i < toIndex) {

            (, applicant, sharesRequested, , , , processed, didPass, aborted, tokenTribute, , ) = abodao.proposalQueue(i);

            if (!processed) { break; }

            // passing grant proposal, mint pool shares proportionally on behalf of the applicant
            if (!aborted && didPass && tokenTribute == 0 && sharesRequested > 0) {
                // This can't revert: sharesRequested is <= 10**18
                _mintSharesForAddress(sharesRequested, applicant);
            }

            i++;
        }

        currentProposalIndex = i;

        emit Sync(currentProposalIndex);
    }

    // add tokens to the pool, mint new shares proportionally
    function deposit(uint256 tokenAmount) public active noReentrancy {

        uint256 sharesToMint = totalPoolShares.mul(tokenAmount).div(approvedToken.balanceOf(address(this)));

        require(
            approvedToken.transferFrom(msg.sender, address(this), tokenAmount),
            "AboPool: Deposit transfer failed"
        );

        _mintSharesForAddress(sharesToMint, msg.sender);

        emit Deposit(
            msg.sender,
            sharesToMint,
            tokenAmount
        );
    }

    // burn shares to proportionally withdraw tokens in pool
    function withdraw(uint256 sharesToBurn) public active noReentrancy {
        _withdraw(msg.sender, sharesToBurn);

        emit Withdraw(
            msg.sender,
            sharesToBurn
        );
    }

    // keeper burns shares to withdraw on behalf of the donor
    function keeperWithdraw(uint256 sharesToBurn, address recipient) public active noReentrancy {
        require(
            donors[recipient].keepers[msg.sender],
            "AboPool: Sender is not a keeper"
        );

        _withdraw(recipient, sharesToBurn);

        emit KeeperWithdraw(
            recipient,
            sharesToBurn,
            msg.sender
        );
    }

    function addKeepers(address[] calldata newKeepers) external active noReentrancy {
        Donor storage donor = donors[msg.sender];

        for (uint256 i = 0; i < newKeepers.length; i++) {
            donor.keepers[newKeepers[i]] = true;
        }

        emit AddKeepers(msg.sender, newKeepers);
    }

    function removeKeepers(address[] calldata keepersToRemove) external active noReentrancy {
        Donor storage donor = donors[msg.sender];

        for (uint256 i = 0; i < keepersToRemove.length; i++) {
            donor.keepers[keepersToRemove[i]] = false;
        }

        emit RemoveKeepers(msg.sender, keepersToRemove);
    }

    function _mintSharesForAddress(uint256 sharesToMint, address recipient) internal {
        totalPoolShares = totalPoolShares.add(sharesToMint);
        donors[recipient].shares = donors[recipient].shares.add(sharesToMint);

        require(
            totalPoolShares <= MAX_NUMBER_OF_SHARES,
            "AboPool: Max number of shares exceeded"
        );

        emit SharesMinted(
            sharesToMint,
            recipient,
            totalPoolShares
        );
    }

    function _withdraw(address recipient, uint256 sharesToBurn) internal {
        Donor storage donor = donors[recipient];

        require(
            donor.shares >= sharesToBurn,
            "AboPool: Not enough shares to burn"
        );

        uint256 tokensToWithdraw = approvedToken.balanceOf(address(this)).mul(sharesToBurn).div(totalPoolShares);

        totalPoolShares = totalPoolShares.sub(sharesToBurn);
        donor.shares = donor.shares.sub(sharesToBurn);

        require(
            approvedToken.transfer(recipient, tokensToWithdraw),
            "AboPool: Withdrawal transfer failed"
        );

        emit SharesBurned(
            sharesToBurn,
            recipient,
            totalPoolShares
        );
    }

}
