import * as React from "react"
import Helmet from "react-helmet";
import detectEthereumProvider from '@metamask/detect-provider'
import { Button, Container, Slider, CircularProgress } from "@mui/material";
import * as Constants from '../constants'
import { GrassOutlined, AccountBalanceWalletOutlined, CompareArrowsOutlined } from '@mui/icons-material'
import Snackbar from '@mui/material/Snackbar';

import Web3EthContract from "web3-eth-contract";
import Web3Utils from 'web3-utils'

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mintAmount: 1,
      balance: 0,
      currentAccount: "",
      contract: null,
      contractLoaded: false,
      totalSupply: 0,
      maxSupply: 0,
      provider: {
        installed: false,
        chainId: 1, // 1:ETH Mainnet,
        connected: false,
      },
      snackbar: false,
      snackbarMessage: "",
      minting: false,
    };

    this.handleAccountsChanged = this.handleAccountsChanged.bind(this);
    this.connectToWallet = this.connectToWallet.bind(this);
    this.mint = this.mint.bind(this);
    this.handleMintAmountSliderChange = this.handleMintAmountSliderChange.bind(this);
    this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);
    this.switchNetwork = this.switchNetwork.bind(this);
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
    console.log("Decentralized app starting...")
    const chainId = await provider.request({ method: Constants.ETH_METHOD_CHAINID });
    this.setState({ provider: { ...this.state.provider, chainId: chainId } });
    this.ethRequestAccounts(provider);
  }

  ethRequestAccounts(provider) {
    provider
      .request({ method: Constants.ETH_METHOD_REQUEST_ACCOUNTS })
      .then(this.handleAccountsChanged)
      .catch((err) => {
        if (err.code === 4001) {
          console.log('Please connect to MetaMask.');
        } else {
          console.error(err);
        }
      });
  }

  handleChainChanged(_chainId) {
    console.log("Chain changed. Reloading window")
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }

  async handleAccountsChanged(accounts) {
    console.log("Account set to", accounts);
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts      
      this.openSnackbar('Please connect to MetaMask.')
    } else if (accounts[0] !== this.state.currentAccount) {
      this.setState({ provider: { ...this.state.provider, connected: true } })
      const account = accounts[0];
      this.state.currentAccount = account;

      const ethereum = await this.ethereumProvider();

      if (this.state.provider.chainId === Constants.POLYGON_CHAIN_ID) {
        // On Right Chain, Load Smart Contracts
        this.loadContract(ethereum);
        this.loadBalance(ethereum);
      }
    }
  }

  async switchNetwork() {
    const ethereum = await this.ethereumProvider();
    if (ethereum) {
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
    }
  }

  async loadBalance(provider) {
    console.log("Loading your balance...")
    const result = await provider.request({ method: Constants.ETH_METHOD_GET_BALANCE, params: [this.state.currentAccount, 'latest'] });
    this.setState({ balance: Web3Utils.fromWei(result) });
    console.log("Your balance is ", result)
  }

  async loadContract(provider) {
    if (provider) {
      console.log("Loading the contract...")
      const abiResponse = await fetch(Constants.ABI_PATH, {
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

        console.log("The contract loaded successfully.")
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
    console.log("Total supply of this NFT:", totalSupply);
  }

  async loadMaxSupply(contract) {
    const maxSupply = await contract.methods
      .maxSupply()
      .call({
        from: this.state.currentAccount
      });
    this.setState({ maxSupply: maxSupply })
    console.log("Max Supply of this NFT:", maxSupply);
  }

  async connectToWallet() {
    const ethereum = await this.ethereumProvider();
    if (ethereum) {
      this.openSnackbar("Connecting to your wallet...");
      this.ethRequestAccounts(ethereum);
    }
  }

  async mint() {
    const contract = this.state.contract;
    const account = this.state.currentAccount;
    const mintAmount = this.state.mintAmount;
    const cost = Constants.CONTRACT_WEI_COST;
    const gasLimit = Constants.CONTRACT_GAS_LIMIT;
    const totalCostWei = String(cost * mintAmount);
    const totalGasLimit = String(gasLimit * mintAmount);

    console.log("Mint Amount:", mintAmount);
    console.log("Cost:", cost);
    console.log("Total Cost Wei:", totalCostWei);
    console.log("Total Gas Limit:", totalGasLimit);

    this.openSnackbar("Start Minting...");
    this.setState({ minting: true })

    try {
      const receipt = await contract.methods
        .mint(mintAmount)
        .send({
          gasLimit: String(totalGasLimit),
          to: Constants.CONTRACT_ADDRESS,
          from: account,
          value: totalCostWei,
        });

      console.log(receipt);
      this.openSnackbar(`${Constants.NFT_NAME} is yours! go visit Opensea.io to view it.`)
      this.loadBalance();
      this.loadTotalSupply();
    } catch (err) {
      this.openSnackbar(err.message)
      console.log(err)
    } finally {
      this.setState({ minting: false })
    }
  }

  handleMintAmountSliderChange(event, newValue) {
    this.setState({ mintAmount: newValue })
  }

  openSnackbar(msg) {
    console.log('Snackbar:', msg);
    this.setState({ snackbarMessage: msg })
    this.setState({ snackbar: true })
  }

  handleCloseSnackbar(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ snackbar: false })
    this.setState({ snackbarMessage: "" })
  }

  truncate(input, len) {
    return input.length > len ? `${input.substring(0, len)}...` : input;
  }

  render() {
    return (
      <main style={pageStyles}>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Super Urban Cat NFT Minting dApp</title>
          <script type="application/ld+json">
            {`
              {
                "@context": "https://schema.org",
                "@type": "CreativeWork",
                "url": "https://www.superurbancat.com",
                "name": "Super Urban Cat NFT Minting dApp",
                "abstract": "Decentralized web application for minting NFT, Super Urban Cat(SUC). Super Urban Cats are adorable creatures of 10,000 randomly generated. The cats are living in Super Urban City. The people in the city so called Super Urban People used to be a good friend of the cats. But after they realized the taste of coffee, they stopped being frineds of the cats. Now Super Urban Cats are lonely. Would you adopt one and take good care of it?"
              }
            `}
          </script>
        </Helmet>
        <h1>Super Urban Cat Minting dApp</h1>
        <Container maxWidth="sm" sx={mintContainer}>

          {this.state.contract && <p style={highlightTextStyles}>{this.state.totalSupply} / {this.state.maxSupply}</p>}
          <img src="/images/sucrolling.gif" alt="Super Urban Cat Rolling Images" />
          <p style={highlightTextStyles}>1 {Constants.CONTRACT_SYMBOL} costs 0.5 {Constants.POLYGON_CHAIN_PARAM[0].nativeCurrency.symbol}.<br /></p>
          <div style={noteStyles}>Excluding gas fees.</div>

          <p>{this.state.contractLoaded}</p>
          { // Before metamask installed
            !this.state.provider.installed &&
            <p>Please Install MetaMask. <a href={Constants.METAMASK_DOWNLOAD} target="_blank" rel="noreferrer">{Constants.METAMASK_DOWNLOAD}</a></p>
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
              CONNECT
            </Button>
          }

          { // Need add or switch network to polygon mainnet
            (this.state.provider.installed && this.state.provider.connected && this.state.provider.chainId !== Constants.POLYGON_CHAIN_ID) &&
            <p>
              <Button
                size="large"
                variant="contained"
                color="secondary"
                onClick={this.switchNetwork}
                startIcon={<CompareArrowsOutlined />}
              >
                Switch Network TO POLYGON MAINNET
              </Button>
            </p>
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
                disabled={this.state.minting}
                onClick={this.mint}
                startIcon={<GrassOutlined />}>
                BUY {this.state.mintAmount} NFT{this.state.mintAmount > 0 ? "s" : ""}{this.state.minting && <CircularProgress size={20} sx={{ marginLeft: 1 }} />}
              </Button>

              <div style={{ marginTop: 5 }}>
                <span style={{ color: (Math.ceil(this.state.balance * 10) / 10) > (this.state.mintAmount * Constants.CONTRACT_DISPLAY_COST) ? 'var(--primary-text)' : 'red' }}>{this.state.mintAmount * Constants.CONTRACT_DISPLAY_COST}</span> / {Math.ceil(this.state.balance * 10) / 10} {Constants.POLYGON_CHAIN_PARAM[0].nativeCurrency.symbol}
              </div>
            </div>
          }
          <div style={codeStyles}>Opensea: <a href={Constants.MARKETPLACE_LINK} target="_blank" rel="noreferrer">{Constants.MARKETPLACE_LINK}</a></div>
          <div style={codeStyles}>Contract: <a style={linkStyle} href={Constants.POLYGON_SCAN + "/" + Constants.CONTRACT_ADDRESS} target="_blank" rel="noreferrer">{this.truncate(Constants.CONTRACT_ADDRESS, 15)}</a></div>

          <p style={{ ...noteStyles, textAlign: 'left' }}>Please make sure that the website address is "superurbancat.com", and then connect your wallet.</p>
        </Container>

        <p style={noteStyles}>
          Please make sure you are connected to Polygon Mainnet and the correct address.
        </p>
        <p style={noteStyles}>
          Please note: Once you make the purchase, you cannot undo this action.
        </p>
        <p style={noteStyles}>
          We have set the gas limit to {Constants.CONTRACT_GAS_LIMIT} for the contract to
          successfully mint your NFT. We recommend that you don't lower the
          gas limit.
        </p>
        <p><a style={linkStyle} href={Constants.DISCORD_LINK} target="_blank" rel="noreferrer">Official Discord</a></p>
        <div><Snackbar
          open={this.state.snackbar}
          autoHideDuration={6000}
          onClose={this.handleCloseSnackbar}
          message={this.state.snackbarMessage}
        /></div>
      </main>
    )
  }
}

export default Index

// styles
const pageStyles = {
  textAlign: 'center',
}

const mintContainer = {
  backgroundColor: '#CCFFEF',
  border: '2px dashed grey',
  borderRadius: 10,
}

const buttonStyles = {
  fontFamily: "Mukta"
}
const noteStyles = {
  marginBottom: 10,
  color: 'grey',
  fontSize: '0.8em',
}

const highlightTextStyles = {
  fontSize: 30,
  textAlign: 'center',
  fontWeight: 'bold',
  margin: 10,
}

const codeStyles = {
  color: "#8A6534",
}

const linkStyle = {
  color: "#8954A8",
  fontWeight: "bold",
  fontSize: 16,
  verticalAlign: "5%",
}