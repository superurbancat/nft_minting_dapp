export const POLYGON_CHAIN_ID = '0x89';
export const POLYGON_CHAIN_PARAM = [{
    chainId: POLYGON_CHAIN_ID,
    chainName: 'Polygon Mainnet',
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

export const CONTRACT_ADDRESS = '0x3f9a3d46477420103fe07c0afe8e3ce5e2ad22d1';
export const CONTRACT_SYMBOL = "SUC";
export const CONTRACT_MAX_SUPPLY = 10000;
export const CONTRACT_MAX_MINT = 20;
export const CONTRACT_WEI_COST = 500000000000000000n;
export const CONTRACT_DISPLAY_COST = 0.5;
export const CONTRACT_GAS_LIMIT = 285000;
export const MARKETPLACE = "Opensea";
export const MARKETPLACE_LINK = "https://opensea.io/collection/superurbancat";