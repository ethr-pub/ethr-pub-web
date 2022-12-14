import { useEffect, useState } from 'react';
import { useAccount, useSigner } from 'wagmi';
import { useMyStore } from './useMyStore';

const defaultGateway = [
  'https://ipfs.io',
  'https://cf-ipfs.com',
  'https://gateway.pinata.cloud',
  'https://cloudflare-ipfs.com',
];

export const useIpfsGateway = () => {
  const [current, _current] = useMyStore('ipfsGateway');
  const gatewayList = (() => {
    if (current && !defaultGateway.includes(current)) return [current, ...defaultGateway];
    return defaultGateway;
  })();

  return {
    gatewayList,
    current,
    _current,
  };
};
