import Loadable from "@loadable/component"

const LoadableWeb3EthContract = Loadable(()=>import('web3-eth-contract'))

export default LoadableWeb3EthContract