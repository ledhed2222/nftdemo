const { RippleAPI, xrpToDrops } = require('@ledhed2222/ripple-lib')
const rippleKeypairs = require('ripple-keypairs')

// this is nik's development server
const serverUri = 'ws://71.38.165.199:6006'
// const serverUri = 'wss://uhm.solike.wtf:7007'
const client = new RippleAPI({server: serverUri})

// these are the values of the 'root' account for standalone mode
const ISSUER_ADDRESS = 'rpF8Fp5XzgurLvtFZvMddToHYu2DwXsRY7'

const main = async () => {
  await client.connect()
  const response = await client.request('account_nfts', {
    account: ISSUER_ADDRESS,
  })
  await client.disconnect()
  console.log(`response:\n\t${JSON.stringify(response)}\n\n`)
}
main()
