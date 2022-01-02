import * as React from "react"

import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import { Button, Avatar, Container } from "@mui/material";
import { Helmet } from "react-helmet"
import MetaMaskButton from '../components/MetaMaskButton'


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


class Index extends React.Component {
  constructor(props) {
    super(props);
    // this.isBrowser = typeof window !== "undefined";
    // this.ethereum = window;
    this.state = {
      totalSupply:1
    };
  }
  
  

  render() {
    return (
      <main style={pageStyles}>
        <title>Super Urban Cat Minting dAPP</title>
        <h1 style={headingStyles}>Super Urban Cat</h1>
        <h2>Minting Dapp</h2>
        <Container maxWidth="sm" sx={{ p: 2, border: '1px dashed grey' }}>
          <p style={supplyTextStyles}>{this.state.totalSupply}/1</p>
          <Button>Mint</Button>
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
          Please make sure you are connected to Polygon Mainnet and the correct address. Please note: Once you make the purchase, you cannot undo this action.
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
        <MetaMaskButton/>
      </main>
    )
  }
};
export default Index
