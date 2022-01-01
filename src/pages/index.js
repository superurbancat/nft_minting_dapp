import * as React from "react"

import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import { Button, Avatar } from "@mui/material";
import { Helmet } from "react-helmet"

// styles
const pageStyles = {
  color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
  textAlign: 'center'
}
const headingStyles = {
  marginTop: 0,
  // maxWidth: 320,
}
const headingAccentStyles = {
  color: "#663399",
}
const paragraphStyles = {
  marginBottom: 48,
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

// markup
const IndexPage = () => {

  const [blockNr, setBlockNr] = React.useState()
  const isBrowser = typeof window !== "undefined"

  const { ethereum } = window;

  async function getBlockNumber() {
    console.log('Init web3')
    const web3 = new window.Web3('https://cloudflare-eth.com')
    const currentBlockNumber = await web3.eth.getBlockNumber()
    setBlockNr(currentBlockNumber)
  }

  async function addNetwork() {
    let web3;
    if (typeof ethereum !== 'undefined') {
      web3 = new window.Web3(ethereum);
    } else if (typeof web3 !== 'undefined') {
      web3 = new window.Web3(window.Web3.givenProvider);
    } else {
      web3 = new window.Web3(ethereum);
    }

    if (typeof web3 !== 'undefined') {
      var network = 0;
      network = await web3.eth.net.getId();
      const netID = network.toString();
    
      if (netID == "137") {
        alert("Polygon Network has already been added to Metamask.");
        return;
      } else {
        const params = [{
          chainId: '0x89',
          chainName: 'Matic Mainnet',
          nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18
          },
          rpcUrls: ['https://polygon-rpc.com/'],
          blockExplorerUrls: ['https://polygonscan.com/']
        }]

        window.ethereum.request({ method: 'wallet_addEthereumChain', params })
        .then(() => console.log('Success'))
        .catch((error) => console.log("Error", error.message));
      }
    } else {
      alert('Unable to locate a compatible web3 browser!');
    }
  }

  return (
    <main style={pageStyles}>
      <Helmet>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js" />
      </Helmet>
      <title>Super Urban Cat Minting dAPP</title>
      <h1 style={headingStyles}>Super Urban Cat</h1>
      <h2>Minting Dapp</h2>
      {isBrowser &&
        <div>
          <p>Running in browser..</p>
          <button onClick={getBlockNumber}>Get Block #</button>
        </div>
      }

      {blockNr && <span>{blockNr}</span>}
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
        Please make sure you are connected to Polygon Mainnet and the correct address. Please note: Once you make the purchase, you cannot undo this action.
      </p>
      {/* <button type="button" class="btn btn-xss btn-soft-light text-nowrap d-flex align-items-center mr-2" onclick="addNetwork('web3');"> */}
      {/* <img width="15" src={MetaMaskImg} alt="Metamask"/> Add Polygon Network */}
      {/* </button> */}
      {/* <Button variant="contained" color="primary" startIcon={<DeleteIcon />}>
      Hello World
    </Button> */}
      <Button
        variant="contained"
        color="secondary"
        onClick={addNetwork}
        startIcon={<Avatar src={'/images/metamask.svg'} />}
      >
        Add to network
      </Button>
    </main>
  )
}

export default IndexPage
