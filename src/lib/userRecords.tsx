import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAccount, useSigner } from 'wagmi';
import Constants from '../constants';
import { useLogin } from './useLogin';

export const useUserRecords = () => {
  const acc = useAccount();
  const signer = useSigner();
  const auth = useLogin();
  const [data, _data] = useState<
    Array<{
      content: string; //    "dnslink=/ipfs/QmNnvnFE7T2KmZo6pZW1Z2AmQfYT7sMmJA5NmcKRWyTAdV";
      created_on: string; //    "2022-12-05T08:48:15.316953Z";
      id: string; //    "f230f1ce284f1de1d1a70926ea80d656";
      locked: boolean;
      meta: { auto_added: boolean; managed_by_apps: boolean; managed_by_argo_tunnel: boolean; source: 'primary' };
      modified_on: string; //    "2022-12-05T08:48:15.316953Z";
      name: string; //    "_dnslink.0x10febdb47de894026b91d639049e482f7e8c7e2e.data.ipns.fun";
      proxiable: boolean;
      proxied: boolean;
      ttl: 1;
      type: string; //    "TXT";
      zone_id: string; //    "ca8e3cb63a6c6a37d56430939854bc3b";
      zone_name: string; //    "ipns.fun";
    }>
  >([]);
  useEffect(() => {
    console.log('user address change', acc.address);
    getRecords();
  }, [auth.msg, acc.address, signer.data]);

  const revert = {
    res: data,
    update: getRecords,
  };

  async function getRecords() {
    const address = acc.address;
    if (!address) return;
    if (!signer.data) return;
    if (!auth.msg) return;
    const req = {
      action: 'get-my-data',
      address: acc.address,
      data: { authMessage: auth.msg },
    };
    const res = await axios.post(Constants.API, req);
    console.log(res.data);
    _data(res.data.result || []);
  }

  if (!acc.address) return revert;
  if (!signer.data) return revert;
  return revert;
};
