import * as React from "react"

import detectEthereumProvider from '@metamask/detect-provider'
import { Button, Container, Slider } from "@mui/material";
// import { Helmet } from "react-helmet"
import * as Constants from '../constants'
import { GrassOutlined, AccountBalanceWalletOutlined } from '@mui/icons-material'

import Web3EthContract from "web3-eth-contract";
import Web3Utils from 'web3-utils'

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mintAmount: 1,
      balance: 0,
      provider: {
        installed: false,
        chainId: 1, // 1:ETH Mainnet,
        connected: false,
      },
      currentAccount: "",
      contract: null,
      contractLoaded: false,
      totalSupply: 0,
      maxSupply: 0
    };

    this.handleAccountsChanged = this.handleAccountsChanged.bind(this);
    this.connectToWallet = this.connectToWallet.bind(this);
    this.mint = this.mint.bind(this);
    this.handleMintAmountSliderChange = this.handleMintAmountSliderChange.bind(this);
  }

  async componentDidMount() {
    const provider = await this.ethereumProvider();
    if (provider) {
      provider.on('chainChanged', this.handleChainChanged);
      this.setState({ provider: { ...this.state.provider, installed: true } });
      this.startApp(provider); // Initialize your app
    } else {
      console.log('Please install MetaMask!');
    }
  }

  async ethereumProvider() {
    return detectEthereumProvider({ mustBeMetaMask: true });
  }


  async startApp(provider) {
    console.log("App starting...")
    const chainId = await provider.request({ method: 'eth_chainId' });
    this.setState({ provider: { ...this.state.provider, chainId: chainId } });
    this.currentEthAccount(provider);
  }

  currentEthAccount(provider) {
    provider
      .request({ method: 'eth_accounts' })
      .then(this.handleAccountsChanged)
      .catch((err) => {
        // Some unexpected error.
        // For backwards compatibility reasons, if no accounts are available,
        // eth_accounts will return an empty array.
        console.error(err);
      });
  }

  handleChainChanged(_chainId) {
    window.location.reload();
  }

  async handleAccountsChanged(accounts) {
    console.log("handleAccountsChanged", accounts);
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask.');
    } else if (accounts[0] !== this.state.currentAccount) {

      console.log("Accounts", accounts[0]);
      this.setState({ provider: { ...this.state.provider, connected: true } })
      const account = accounts[0];
      this.state.currentAccount = account;

      const ethereum = await this.ethereumProvider();

      if (this.state.provider.chainId !== Constants.POLYGON_CHAIN_ID) {
        try {
          await ethereum.request({ method: Constants.WALLET_SWITCH_ETHEREUM_CHAIN, params: [{ chainId: Constants.POLYGON_CHAIN_ID }] });
        } catch (switchError) {
          try {
            await ethereum.request({
              method: Constants.WALLET_ADD_ETHEREUM_CHAIN,
              params: Constants.POLYGON_CHAIN_PARAM,
            });
          } catch (addError) {
            console.log(addError);
          }
        }
      } else {
        // On Right Chain, Load Smart Contracts
        this.loadContract(ethereum);
        this.loadBalance(ethereum);
      }
    }
  }

  async loadBalance(provider) {
    const result = await provider.request({ method: 'eth_getBalance', params: [this.state.currentAccount, 'latest'] });
    this.setState({ balance: Web3Utils.fromWei(result) });
  }

  async loadContract(provider) {
    if (provider) {
      const abiResponse = await fetch("/config/abi.json", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const abi = await abiResponse.json();

      Web3EthContract.setProvider(provider);

      const chainId = this.state.provider.chainId;

      if (chainId === Constants.POLYGON_CHAIN_ID) {
        const contract = new Web3EthContract(
          abi,
          Constants.CONTRACT_ADDRESS
        );

        this.setState({ contract: contract });
        this.setState({ contractLoaded: true })

        this.loadTotalSupply(contract);
        this.loadMaxSupply(contract);
      }
    }
  }

  async loadTotalSupply(contract) {
    const totalSupply = await contract.methods
      .totalSupply()
      .call({
        from: this.state.currentAccount
      });

    this.setState({ totalSupply: totalSupply })
    console.log("total supply:", totalSupply);
  }

  async loadMaxSupply(contract) {
    const maxSupply = await contract.methods
      .maxSupply()
      .call({
        from: this.state.currentAccount
      });
    this.setState({ maxSupply: maxSupply })
    console.log("maxSupply:", maxSupply);
  }

  async connectToWallet() {
    const ethereum = await this.ethereumProvider();
    if (ethereum) {
      ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(this.handleAccountsChanged)
        .catch((err) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            console.log('Please connect to MetaMask.');
          } else {
            console.error(err);
          }
        });
    }
  }

  async mint() {
    console.log("Contract", this.state.contract);
    if (this.state.contract) {

    }

  }

  handleMintAmountSliderChange(event, newValue) {
    this.setState({mintAmount:newValue})
  }

  render() {
    return (
      <main style={pageStyles}>
        <title>Super Urban Cat Minting dAPP</title>
        <h1 style={headingStyles}>Super Urban Cat</h1>
        <h2>Minting Dapp</h2>

        <h2></h2>

        <Container maxWidth="sm" sx={{ p: 2, border: '1px dashed grey' }}>
          {this.state.contract && <p style={supplyTextStyles}>{this.state.totalSupply}/{this.state.maxSupply}</p>}
          <p style={highlightTextStyles}>1 {Constants.CONTRACT_SYMBOL} costs 0.5 {Constants.POLYGON_CHAIN_PARAM[0].nativeCurrency.symbol}.<br /></p>
          <div style={{ marginBottom: 10 }}>Excluding gas fees.</div>
          <div style={codeStyles}>Wallet Address: <span>{this.state.provider.connected ? <a style={linkStyle} href={"https://polygonscan.com/address/" + this.state.currentAccount} target="_blank" rel="noreferrer">{this.state.currentAccount}</a> : "Not connected"}</span></div>
          <div style={codeStyles}>Contract Address: <a style={linkStyle} href={"https://polygonscan.com/token/" + Constants.CONTRACT_ADDRESS} target="_blank" rel="noreferrer">{Constants.CONTRACT_ADDRESS}</a></div>

          {this.state.balance > 0 && <p>You have <strong>{this.state.balance} {Constants.POLYGON_CHAIN_PARAM[0].nativeCurrency.symbol}</strong></p>}
          <p>{this.state.contractLoaded}</p>
          { // Before metamask installed
            !this.state.provider.installed &&
            <p>Please Install MetaMask. <a href="https://metamask.io/download" target="_blank" rel="noreferrer">https://metamask.io/download</a></p>
          }

          { // Need add or switch network to polygon mainnet
            (this.state.provider.installed && this.state.provider.chainId !== Constants.POLYGON_CHAIN_ID) &&
            <p>
              Switching Network to Polygon Mainnet
            </p>
          }

          { // Connect to wallet
            this.state.provider.installed && !this.state.provider.connected &&
            <Button
              size="large"
              variant="contained"
              color="secondary"
              onClick={this.connectToWallet}
              startIcon={<AccountBalanceWalletOutlined />}
            >
              Connect
            </Button>
          }

          { // Time to mint
            this.state.provider.installed && this.state.provider.connected && this.state.provider.chainId === Constants.POLYGON_CHAIN_ID &&
            <div>
              <Slider
                aria-label="Mint amount"
                defaultValue={1}
                onChange={this.handleMintAmountSliderChange}
                step={1}
                marks
                min={1}
                max={Constants.CONTRACT_MAX_MINT}
                valueLabelDisplay="auto"
              />
              <Button
                style={buttonStyles}
                variant="contained"
                color="secondary"
                size="large"
                onClick={this.mint}
                startIcon={<GrassOutlined />}>
                Buy {this.state.mintAmount} NFT{this.state.mintAmount > 0 ? "s" : ""}
              </Button>
              <div style={{marginTop:5}}>
                Costs {this.state.mintAmount * Constants.CONTRACT_DISPLAY_COST} {Constants.POLYGON_CHAIN_PARAM[0].nativeCurrency.symbol} excluding gas fees.
              </div>
            </div>
          }
          <p>Beware of fake sites. Please make sure that the website address is "superurbancat.com", and then connect your wallet.</p>
        </Container>

        <p style={paragraphStyles}>
          Please make sure you are connected to Polygon Mainnet and the correct address.
        </p>
        <p style={paragraphStyles}>
          Please note: Once you make the purchase, you cannot undo this action.
        </p>
        <p style={paragraphStyles}>
          We have set the gas limit to {Constants.CONTRACT_GAS_LIMIT} for the contract to
          successfully mint your NFT. We recommend that you don't lower the
          gas limit.
        </p>
        <p><a style={linkStyle} href="https://discord.gg/R6PQUUjXHC" target="_blank" rel="noreferrer">Official Discord</a></p>
      </main>
    )
  }
}

export default Index

// styles
const pageStyles = {
  color: "#232129",
  padding: 96,
  // fontFamily: "-apple-system, Press Start 2P, sans-serif, serif",
  // fontFamily: "'Press Start 2P', cursive",
  // fontFamily: "-apple-system, Acme, sans-serif",
  // fontFamily: "-apple-system, Concert One, cursive",
  textAlign: 'center'
}
const headingStyles = {
  marginTop: 0,
  // maxWidth: 320,
}

const buttonStyles = {
  fontFamily: "-apple-system, Acme, sans-serif",
}
const paragraphStyles = {
  marginBottom: 10,
}

const supplyTextStyles = {
  fontSize: 50,
  textAlign: 'center',
  fontWeight: 'bold'
}

const highlightTextStyles = {
  fontSize: 30,
  textAlign: 'center',
  fontWeight: 'bold',
  margin: 10,
}

const codeStyles = {
  color: "#8A6534",
  padding: 4,
  // backgroundColor: "#FFF4DB",
  fontSize: "1.25rem",
  borderRadius: 4,
}

const linkStyle = {
  color: "#8954A8",
  fontWeight: "bold",
  fontSize: 16,
  verticalAlign: "5%",
}