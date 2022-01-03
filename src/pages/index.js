import * as React from "react"

import detectEthereumProvider from '@metamask/detect-provider'
import { Button, Container, Chip, Avatar, Paper } from "@mui/material";
import { Helmet } from "react-helmet"
import * as Constants from '../constants'
import { GrassOutlined, AccountBalanceWalletOutlined, Check } from '@mui/icons-material'
import LoadableWeb3EthContract from '../components/LoadableWeb3EthContract'

import Web3EthContract from "web3-eth-contract";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalSupply: 1,
      provider: {
        installed: false,
        chainId: 1, // 1:ETH Mainnet,
        connected: false,
      },
      currentAccount: "",
      contract: null,
      contractLoaded: false,
    };

    this.handleAccountsChanged = this.handleAccountsChanged.bind(this);
    this.connectToWallet = this.connectToWallet.bind(this);
    this.mint = this.mint.bind(this);
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
      }
    }
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

      console.log("ABI", abi);

      Web3EthContract.setProvider(provider);

      const chainId = this.state.provider.chainId;

      if(chainId === Constants.POLYGON_CHAIN_ID) {
        const contract = new Web3EthContract(
          abi,
          Constants.CONTRACT_ADDRESS
        );

        this.setState({contract: contract});
        this.setState({contractLoaded : true})
      }
    }
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
    if(this.state.contract) {

    }
    
  }

  render() {
    return (
      <main style={pageStyles}>
        <title>Super Urban Cat Minting dAPP</title>
        <h1 style={headingStyles}>Super Urban Cat</h1>
        <h2>Minting Dapp</h2>

        <h2></h2>
        <Container maxWidth="sm" sx={{textAlign:"left", marginBottom: 5}}>
          <Paper>Wallet Address: {this.state.currentAccount}</Paper>
          <Paper>Contract Address: {Constants.CONTRACT_ADDRESS}</Paper>
          <Paper> Tomorrow</Paper>
          <Chip icon={<Avatar src="/images/metamask.svg" sx={{ width: 20, height: 20 }}/>} label={"Wallet: " + this.state.currentAccount} color={this.state.provider.connected ? "success" : "default"}/>&nbsp;          
          
          <Chip label="Chip Filled" />&nbsp;
        </Container>

        <Container maxWidth="sm" sx={{ p: 2, border: '1px dashed grey' }}>
          <p style={supplyTextStyles}>{this.state.totalSupply}/1</p>
          <p> {this.state.contractLoaded}</p>
          { // Before metamask installed
            !this.state.provider.installed &&
            <p>Please Install MetaMask. <a href="https://metamask.io/download" target="_blank">https://metamask.io/download</a></p>
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
            <Button
              style={buttonStyles}
              variant="contained"
              color="secondary"
              size="large"
              onClick={this.mint}
              startIcon={<GrassOutlined />}>
              Mint
            </Button>
          }

        </Container>

        {/* {isBrowser &&
          <div>
            <p>Running in browser..</p>
            <button onClick={getBlockNumber}>Get Block #</button>
          </div>
        }
  
        {blockNr && <span>{blockNr}</span>} */}
        {/* <p style={paragraphStyles}>
          Edit <code style={codeStyles}>src/pages/index.js</code> to see this page
          update in real-time.{" "}
          <span role="img" aria-label="Sunglasses smiley emoji">
            😎
          </span>
        </p> */}
        {/* <ul style={listStyles}>
          <li style={docLinkStyle}>
            <a
              style={linkStyle}
              href={`${docLink.url}?utm_source=starter&utm_medium=start-page&utm_campaign=minimal-starter`}
            >
              {docLink.text}
            </a>
          </li>
          {links.map(link => (
            <li key={link.url} style={{ ...listItemStyles, color: link.color }}>
              <span>
                <a
                  style={linkStyle}
                  href={`${link.url}?utm_source=starter&utm_medium=start-page&utm_campaign=minimal-starter`}
                >
                  {link.text}
                </a>
                {link.badge && (
                  <span style={badgeStyle} aria-label="New Badge">
                    NEW!
                  </span>
                )}
                <p style={descriptionStyle}>{link.description}</p>
              </span>
            </li>
          ))}
        </ul> */}
        <p style={paragraphStyles}>
          Please make sure you are connected to Polygon Mainnet and the correct address.
        </p>
        <p style={paragraphStyles}>
          Please note: Once you make the purchase, you cannot undo this action.
        </p>
        {/* <button type="button" class="btn btn-xss btn-soft-light text-nowrap d-flex align-items-center mr-2" onclick="addNetwork('web3');"> */}
        {/* <img width="15" src={MetaMaskImg} alt="Metamask"/> Add Polygon Network */}
        {/* </button> */}
        {/* <Button variant="contained" color="primary" startIcon={<DeleteIcon />}>
        Hello World
      </Button> */}
        {/* <Button
          variant="contained"
          color="secondary"
          onClick={this.addNetwork}
          startIcon={<Avatar src={'/images/metamask.svg'} />}
        >
          Add Polygon Network
        </Button> */}

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
  // marginBottom: 48,
}

const supplyTextStyles = {
  fontSize: 50,
  textAlign: 'center',
  fontWeight: 'bold'
}

const codeStyles = {
  color: "#8A6534",
  padding: 4,
  backgroundColor: "#FFF4DB",
  fontSize: "1.25rem",
  borderRadius: 4,
}
const listStyles = {
  marginBottom: 96,
  paddingLeft: 0,
}
const listItemStyles = {
  fontWeight: 300,
  fontSize: 24,
  maxWidth: 560,
  marginBottom: 30,
}

const linkStyle = {
  color: "#8954A8",
  fontWeight: "bold",
  fontSize: 16,
  verticalAlign: "5%",
}

const docLinkStyle = {
  ...linkStyle,
  listStyleType: "none",
  marginBottom: 24,
}

const descriptionStyle = {
  color: "#232129",
  fontSize: 14,
  marginTop: 10,
  marginBottom: 0,
  lineHeight: 1.25,
}

const docLink = {
  text: "Documentation",
  url: "https://www.gatsbyjs.com/docs/",
  color: "#8954A8",
}

const badgeStyle = {
  color: "#fff",
  backgroundColor: "#088413",
  border: "1px solid #088413",
  fontSize: 11,
  fontWeight: "bold",
  letterSpacing: 1,
  borderRadius: 4,
  padding: "4px 6px",
  display: "inline-block",
  position: "relative",
  top: -2,
  marginLeft: 10,
  lineHeight: 1,
}

// data
const links = [
  {
    text: "Tutorial",
    url: "https://www.gatsbyjs.com/docs/tutorial/",
    description:
      "A great place to get started if you're new to web development. Designed to guide you through setting up your first Gatsby site.",
    color: "#E95800",
  },
]