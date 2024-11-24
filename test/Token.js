const { expect } = require('chai');
const { ethers } = require('hardhat');

// Helper function to save us from counting zeros
// Because who really wants to count 18 decimals?
const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Token', () => {
    let token, accounts, deployer, receiver, exchange

    beforeEach(async () => {
        // Deploy our ticket to the moon 🚀
        const Token = await ethers.getContractFactory('Token')
        token = await Token.deploy('Lambo Moon Trillionaire', 'LMT', '1000000000000')

        // Get some test accounts - everyone needs friends
        accounts = await ethers.getSigners()
        deployer = accounts[0]    // The whale 🐋
        receiver = accounts[1]     // The lucky recipient
        exchange = accounts[2]     // The trusted middleman (hopefully)
    })

    describe('deployment', () => {
        // Set up our unrealistic expectations
        const name = 'Lambo Moon Trillionaire'
        const symbol = 'LMT'
        const decimals = '18'
        const totalSupply = tokens('1000000000000') // More zeros than your bank account

        it('has correct name', async () => {
            expect(await token.name()).to.equal(name)
        })
        it('has correct symbol', async () => {
            expect(await token.symbol()).to.equal(symbol)
        })
        it('has correct decimals', async () => {
            expect(await token.decimals()).to.equal(decimals)
        })
        it('has correct total supply', async () => {
            expect(await token.totalSupply()).to.equal(totalSupply)
        })
        it('assigns total supply to deployer', async () => {
            // Deployer gets all tokens - must be nice
            expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)
        })
    })

    describe('Sending Tokens', () => {
        let amount, transaction, result

        describe('Success', () => {
            beforeEach(async () => {
                // Send 100 tokens - spreading the wealth
                amount = tokens('100')
                transaction = await token.connect(deployer).transfer(receiver.address, amount)
                result = await transaction.wait()
            })

            it('transfers token balances', async () => {
                // Check if tokens actually moved (trust but verify)
                expect(await token.balanceOf(deployer.address)).to.equal(tokens('999999999900'))
                expect(await token.balanceOf(receiver.address)).to.equal(amount)
            })

            it('emits a transfer event', async () => {
                // Check if blockchain recorded our generosity
                const event = result.events[0]
                expect(event.event).to.equal('Transfer')

                const args = event.args
                expect(args.from).to.equal(deployer.address)
                expect(args.to).to.equal(receiver.address)
                expect(args.value).to.equal(amount)
            })
        })

        describe('Failure', () => {
            it('rejects insufficient balances', async () => {
                // Try to send more than we have (we've all been there)
                const invalidAmount = tokens('1000000000001')
                await expect(token.connect(deployer).transfer(receiver.address, invalidAmount)).to.be.reverted
            })

            it('rejects invalid recipient', async () => {
                // Try to send to address(0) - The void doesn't need tokens
                const amount = tokens('100')
                await expect(token.connect(deployer).transfer('0x0000000000000000000000000000000000000000', amount)).to.be.reverted
            })
        })
    })

    describe('Approving Tokens', () => {
        let amount, transaction, result

        beforeEach(async () => {
            // Set up allowance - like giving your friend your credit card
            amount = tokens('100')
            transaction = await token.connect(deployer).approve(exchange.address, amount)
            result = await transaction.wait()
        })

        describe('Success', () => {
            it('allocates an allowance for delegated token spending', async () => {
                // Check if allowance is set - trust level: maximum
                expect(await token.allowance(deployer.address, exchange.address)).to.equal(amount)
            })

            it('emits an Approval event', async () => {
                // Blockchain's way of saying "approved!"
                const event = result.events[0]
                expect(event.event).to.equal('Approval')

                const args = event.args
                expect(args.owner).to.equal(deployer.address)
                expect(args.spender).to.equal(exchange.address)
                expect(args.value).to.equal(amount)
            })
        })

        describe('Failure', () => {
            it('rejects invalid spenders', async () => {
                // Can't approve the void - it's already got enough power
                await expect(token.connect(deployer).approve('0x0000000000000000000000000000000000000000', amount)).to.be.reverted
            })
        })
    })

    describe('Delegated Token Transfers', () => {
        let amount, transaction, result

        beforeEach(async () => {
            // First approve exchange - like giving your keys to the valet
            amount = tokens('100')
            transaction = await token.connect(deployer).approve(exchange.address, amount)
            result = await transaction.wait()
        })

        describe('Success', () => {
            beforeEach(async () => {
                // Exchange does the transfer - middleman doing its job
                transaction = await token.connect(exchange).transferFrom(deployer.address, receiver.address, amount)
                result = await transaction.wait()
            })

            it('transfers token balances', async () => {
                // Check if the exchange handled our tokens properly
                expect(await token.balanceOf(deployer.address)).to.equal(tokens('999999999900'))
                expect(await token.balanceOf(receiver.address)).to.equal(amount)
            })

            it('resets the allowance', async () => {
                // Check if allowance is reset - no double spending here
                expect(await token.allowance(deployer.address, exchange.address)).to.equal(0)
            })

            it('emits a transfer event', async () => {
                // Make sure the blockchain saw what happened
                const event = result.events[0]
                expect(event.event).to.equal('Transfer')

                const args = event.args
                expect(args.from).to.equal(deployer.address)
                expect(args.to).to.equal(receiver.address)
                expect(args.value).to.equal(amount)
            })
        })

        describe('Failure', () => {
            it('rejects insufficient amounts', async () => {
                // Try to transfer more than approved - nice try!
                const invalidAmount = tokens('1000000000001')
                await expect(token.connect(exchange).transferFrom(deployer.address, receiver.address, invalidAmount)).to.be.reverted
            })
        })
    })
})