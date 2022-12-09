import { useEffect } from 'react';
import { useAccount, useSigner } from 'wagmi';

export const useUserRecords = () => {
  const acc = useAccount();
  const signer = useSigner();
  useEffect(() => {
    console.log('user address change', acc.address);
    getRecords();
  }, [acc.address]);

  async function getRecords() {
    const address = acc.address;
    if (!address) return;
    if (!signer.data) return;
    const req = {
      action: 'get-my-data',
      address: acc.address,
      data: { authMessage: '' },
    };
    // req.data.authMessage = await signer.data.signMessage(
    //   [`domain: https://${Constants.ipnsDomain}`, `action: login`].join('\r\n\n'),
    // );
    // const res = await axios.post(Constants.API, {});
  }

  if (!acc.address) return [];
  if (!signer.data) return [];
};
