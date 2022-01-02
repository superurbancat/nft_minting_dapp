export const POLYGON_CHAIN_ID = '0x89';
export const POLYGON_CHAIN_PARAM = [{
    chainId: '0x89',
    chainName: 'Matic Mainnet',
    nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18
    },
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com/']
}];

export const WALLET_ADD_ETHEREUM_CHAIN = 'wallet_addEthereumChain';
export const WALLET_SWITCH_ETHEREUM_CHAIN = 'wallet_switchEthereumChain';