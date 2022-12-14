import { useEffect, useState } from 'react';
import Storage from './storage';
import mitt from 'mitt';

const defaultStoreData = {
  ipfsGateway: 'https://gateway.pinata.cloud',
  login: {} as Record<string, string>,
};
const LocalKeys = ['ipfsGateway', 'login'];
type I_LocalStore = typeof defaultStoreData;

const localEmitter = mitt<any>();

export function useMyStore<T extends keyof I_LocalStore>(
  key: T,
): [I_LocalStore[T], React.Dispatch<React.SetStateAction<I_LocalStore[T]>>] {
  const [current, _current] = useState<I_LocalStore[T]>(() => {
    if (LocalKeys.includes(key)) return new Storage(key).get() || defaultStoreData[key];
    return defaultStoreData[key];
  });

  const update: React.Dispatch<React.SetStateAction<I_LocalStore[T]>> = (value) => {
    localEmitter.emit(key, value);
    return _current(value);
  };

  useEffect(() => {
    localEmitter.on(key, _current);
    return () => {
      localEmitter.off(key, _current);
    };
  }, [key]);

  if (current !== defaultStoreData[key]) {
    defaultStoreData[key] = current;
    if (LocalKeys.includes(key)) new Storage(key).set(current);
  }

  return [current, update];
}
