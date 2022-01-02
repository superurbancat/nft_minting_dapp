import * as React from "react"
import { Helmet } from "react-helmet"
import { Button, Avatar } from "@mui/material";

export default class MetaMaskButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {visibility:true};
        // this.setState({
        //     visibility: true
        // });
    }

    async componentDidMount() {
        // await this.checkNetwork();
    }

    async checkNetwork() {
        await window.Web3.currentProvider.enable();
        let web3 = new window.Web3(window.web3.currentProvider);
        if (typeof web3 !== 'undefined') {
            var network = 0;
            network = await web3.eth.net.getId();
            const netID = network.toString();

            if (netID === "137") {
                this.setState({visibility:false});
                return;
            }
        }
    }

    async addNetwork() {
        await window.web3.currentProvider.enable();
        let web3 = new window.Web3(window.web3.currentProvider);

        if (typeof web3 !== 'undefined') {
            var network = 0;
            network = await web3.eth.net.getId();
            const netID = network.toString();

            if (netID === "137") {
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

    render() {
        return (
            <div>
                <Helmet>
                    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js" />
                </Helmet>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={this.addNetwork}
                    startIcon={<Avatar src={'/images/metamask.svg'} />}
                >
                    Add Polygon Network
                </Button>

            </div>
        )
    };
}