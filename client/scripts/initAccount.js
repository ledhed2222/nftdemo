const { Client, xrpToDrops } = require('xrpl')
const rippleKeypairs = require('ripple-keypairs')

// this is nik's development server
const serverUri = 'ws://71.38.165.199:6006'
// const serverUri = 'wss://uhm.solike.wtf:7007'
const client = new Clien(serverUri)

// these are the values of the 'root' account for standalone mode
const senderAddress = 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh'
const senderSecret = 'snoPBrXtMeMyMHUVTgbuqAfg1SUTb'

const receiverSeed = rippleKeypairs.generateSeed({
  algorithm: 'ed25519',
})
const {
  publicKey: receiverPublicKey,
  privateKey: receiverPrivateKey,
} = rippleKeypairs.deriveKeypair(receiverSeed)
const receiverAddress = rippleKeypairs.deriveAddress(receiverPublicKey)

const paymentTx = {
  TransactionType: 'Payment',
  Account: senderAddress,
  Destination: receiverAddress,
  Amount: xrpToDrops(1000000),
}

const main = async () => {
  await client.connect()
  const preparedTransaction = await client.prepareTransaction(paymentTx)
  const signedTransaction = client.sign(preparedTransaction.txJSON, senderSecret)
  const response = await client.request('submit', {
    tx_blob: signedTransaction.signedTransaction,
  })
  await client.disconnect()
  console.log(`response:\n\t${JSON.stringify(response)}\n\n`)
  console.log(`public key:\n\t${receiverPublicKey}\nprivate key:\n\t${receiverPrivateKey}\naddress:\n\t${receiverAddress}\nseed:\n\t${receiverSeed}`)
}
main()
