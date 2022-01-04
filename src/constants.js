export const NFT_NAME = "Super Urban Cat";
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

export const ABI_PATH = "/config/abi.json";

export const ETH_METHOD_ACCOUNTS = 'eth_accounts';
export const ETH_METHOD_CHAINID = 'eth_chainId';
export const ETH_METHOD_GET_BALANCE = 'eth_getBalance';
export const ETH_METHOD_REQUEST_ACCOUNTS = 'eth_requestAccounts';

export const WALLET_ADD_ETHEREUM_CHAIN = 'wallet_addEthereumChain';
export const WALLET_SWITCH_ETHEREUM_CHAIN = 'wallet_switchEthereumChain';

export const CONTRACT_ADDRESS = '0x3f9a3d46477420103fe07c0afe8e3ce5e2ad22d1';
export const CONTRACT_SYMBOL = "SUC";
export const CONTRACT_MAX_SUPPLY = 10000;
export const CONTRACT_MAX_MINT = 50;
export const CONTRACT_WEI_COST = 500000000000000000;
export const CONTRACT_DISPLAY_COST = 0.5;
export const CONTRACT_GAS_LIMIT = 285000;
export const MARKETPLACE = "Opensea";
export const MARKETPLACE_LINK = "https://opensea.io/collection/superurbancat";
export const POLYGON_SCAN = "https://polygonscan.com/token";
export const METAMASK_DOWNLOAD = "https://metamask.io/download";
export const DISCORD_LINK = "https://discord.gg/R6PQUUjXHC";