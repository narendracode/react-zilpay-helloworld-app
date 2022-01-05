import React, { useEffect, useState } from 'react';
import './App.css';
const { BN, Long, bytes, units } = require('@zilliqa-js/util');


// update this address if you deploy new contract.
const CONTRACT_ADDRESS = "zil1kn2m09689tnp3tgv26az32z7hystkzqjf84vl0";
const CHAIN_ID = 333;
const MSG_VERSION = 1;
const GAS_LIMIT = 80000;
function App() {
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    const zilpay = window.zilPay;
    if (!zilpay) {
      console.log("Make sure you have Zilpay extension installed in your Browser.");
      return;
    } else {
      // wallet found
    }
  }

  const connectWallet = async () => {
    try {
      const zilpay = window.zilPay;
      console.log("We have the zilpay object");
      const status = await zilpay.wallet.connect();
      if (status) {
        // user connected the wallet.
        // read users wallet address
        setCurrentAccount(zilpay.wallet.defaultAccount.bech32)
        console.log(`current account : ${JSON.stringify(zilpay.wallet.defaultAccount)}`)
        // setup event listeners here.
      } else {
        // user rejected.
      }
    } catch (error) {
      console.error(`Error encountered while connecting to zilpay ${error}`)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const updateMessage = async (message) => {
    try {
      const zilpay = window.zilPay;
      const VERSION = bytes.pack(CHAIN_ID, MSG_VERSION);
      // const gasPrice = units.toQa('10000', units.Units.Li);
      const minGasPriceRes = await zilpay.blockchain.getMinimumGasPrice();
      const minGasPrice = minGasPriceRes.result;
      // const contract = window.zilPay.contracts.at(CONTRACT_ADDRESS);
      const contract = await zilpay.contracts.at(CONTRACT_ADDRESS);
      console.log('Wait while message is getting saved in blockchain.')
      const callTx = await contract.call(
        'setHello',
        [
          {
            vname: 'msg',
            type: 'String',
            value: message
          }
        ],
        {
          // amount, gasPrice and gasLimit must be explicitly provided
          version: VERSION,
          amount: new zilpay.utils.BN(0),
          gasPrice: minGasPrice,
          gasLimit: zilpay.utils.Long.fromNumber(GAS_LIMIT),
        },
        0,
        false
      );

      console.log(`tx : ${JSON.stringify(callTx)}`)
    } catch (error) {
      console.log('Error while calling contract.')
      throw Error("Error while updating message in smart contract.")
    }
  }
  const askContractToSeyHello = async () => {
    try {
      // calling smart contract transition
      console.log(`askContractToSeyHello  current account : ${currentAccount}`)

      await updateMessage('Hello message2');
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div> Welcome to Zilpay Helloworld Demo </div>
        <br></br>
        <div>
          {currentAccount === "" ? (renderNotConnectedContainer()) : (
            <button onClick={askContractToSeyHello} className="cta-button connect-wallet-button">
              Say Hello
            </button>
          )}
        </div>
      </header>

    </div>
  );
}

export default App;
