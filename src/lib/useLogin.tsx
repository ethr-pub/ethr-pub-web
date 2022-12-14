import { useEffect } from 'react';
import { useAccount, useSigner } from 'wagmi';
import Constants from '../constants';
import { useMyStore } from './useMyStore';

export const useLogin = () => {
  const acc = useAccount();
  const signer = useSigner();
  const [msg, _msg] = useMyStore('login');

  async function checkLogin() {
    const address = acc.address;
    if (!address) return;
    if (!signer.data) return;
    if (msg[address]) return;
    const loginMsg = await signer.data.signMessage(
      [`domain: https://${Constants.ipnsDomain}`, `action: login`].join('\r\n\n'),
    );
    _msg({ ...msg, [address]: loginMsg });
  }

  return {
    msg: msg[acc.address || ''] || '',
    checkLogin,
  };
};
