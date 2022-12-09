import { providers } from 'ethers';
import mitt from 'mitt';
import { useEffect, useRef } from 'react';
import { configureChains, chain, createClient } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import Constants from '../constants';

const { chains, provider, webSocketProvider } = configureChains([chain.mainnet], [publicProvider()]);

export const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: true,
        shimChainChangedDisconnect: true,
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'ipns.fun',
      },
    }),
  ],
  provider,
  webSocketProvider,
});

interface ProviderEvents {
  [index: string | symbol]: any;
  accountsChanged: string;
  chainChanged: number;
  disconnect: [number, string];
}
export const providerBus = mitt<ProviderEvents>();
export const CurrentWalletEnv = { address: '', chainId: '' };

export const useWallet = () => {
  const { current: wallet } = useRef(CurrentWalletEnv);

  // useEffect(async async () => {
  //   const prov = await getProvider();
  //   const [net, addresss] = await Promise.all([prov.getNetwork(), prov.listAccounts()]);
  //   CurrentWalletEnv.chainId = net.chainId;
  //   const address = addresss[0] || '';
  //   CurrentWalletEnv.address = address ? ethers.utils.getAddress(address) : address;
  // }, []);

  return { wallet: CurrentWalletEnv };
};

// export const getExProvider = async (): Promise<WalletConnectProvider> => {
//   if (window.ethereum && window.ethereum.isMetaMask) return window.ethereum;
//   const exProvider = new WalletConnectProvider({
//     rpc: getChainData(Constants.ChainId).rpc_url,
//   });
//   await exProvider.enable();
//   return exProvider;
// };

// let lastProvider: providers.Web3Provider | null = null;
// export const getProvider = async () => {
//   if (lastProvider) return lastProvider;
//   const exProvider = await getExProvider();
//   exProvider.on('accountsChanged', (addresss: string[]) => {
//     const address = addresss[0] || '';
//     CurrentWalletEnv.address = address ? ethers.utils.getAddress(address) : address;
//     providerBus.emit('accountsChanged', address);
//   });
//   exProvider.on('chainChanged', (chainId: string) => {
//     CurrentWalletEnv.chainId = parseInt(chainId);
//     providerBus.emit('chainChanged', CurrentWalletEnv.chainId);
//   });
//   exProvider.on('disconnect', (code: number, reason: string) => {
//     CurrentWalletEnv.address = '';
//     providerBus.emit('disconnect', [code, reason]);
//   });
//   lastProvider = new providers.Web3Provider(exProvider);
//   return lastProvider;
// };

export default useWallet;
