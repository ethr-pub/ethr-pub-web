import { Button, Card, Col, Input, InputRef, message, Modal, Row, Steps, Tag } from 'antd';
import axios from 'axios';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { useAccount, useConnect, useNetwork, useSigner, useSwitchNetwork } from 'wagmi';
import './App.scss';
import { Constants } from './constants';
import { PlusOutlined } from '@ant-design/icons';
import Storage from './lib/storage';
import { Object2Message, txtMiddleEllipsis } from './lib/utils';
import DataContent from './components/DataContent';
import CopyIcon from './components/Copy';
import { useEffect } from 'react';
import { useUserRecords } from './lib/userRecords';

const keyManage = new Storage<string[]>('userKeys');

function App() {
  const acc = useAccount();
  const signer = useSigner();
  const conn = useConnect();
  const net = useNetwork();
  const [inputKey, _inputKey] = useState('');
  const [inputValue, _inputValue] = useState('');
  const [isModalOpen, _isModalOpen] = useState(false);
  const [confirmLoading, _confirmLoading] = useState(false);
  const records = useUserRecords();
  const [UserKeys, _UserKeys] = useState(() => {
    const local = keyManage.get() || [];
    return Array.from(new Set([...Constants.PredefinedKeys, ...local]));
  });
  const stepCurrent = (() => {
    if (!acc.connector) return 0;
    if (!net.chain) return 1;
    return 2;
  })();
  async function Submit(key = '') {
    _inputKey(key);
    _inputValue('');
    _isModalOpen(true);
  }

  async function AddData() {
    const key = inputKey.trim();
    let value = inputValue.trim();
    if (!value) {
      _UserKeys((v) => {
        const newItem = Array.from(new Set([...v, key]));
        keyManage.set(newItem);
        return newItem;
      });
      _isModalOpen(false);
      return;
    }
    if (!value.match(/\//)) value = `/ipfs/${value}`;
    if (!value.match(/^\//)) value = `/${value}`;
    const urls = [`${Constants.ipfsGateway}`, value];
    const url = urls.join('');
    _confirmLoading(true);
    axios
      .get(url)
      .then(async (res) => {
        if (!signer.data) return;
        const req = {
          action: 'set-my-data',
          address: acc.address,
          data: {
            time: new Date().toString(),
            key,
            value: value,
            authMessage: '',
          },
        };
        req.data.authMessage = await signer.data.signMessage(
          [
            `domain: https://${Constants.ipnsDomain}`,
            `time: ${req.data.time}`,
            `key: ${req.data.key}`,
            `value: ${req.data.value}`,
          ].join('\r\n\n'),
        );
        const post = await axios.post(`${Constants.API}`, req);
        console.log(post);
        if (post.data && post.data.success && post.data.result) {
          _UserKeys((v) => {
            const newItem = Array.from(new Set([...v, key]));
            keyManage.set(newItem);
            return newItem;
          });
          _isModalOpen(false);
        }
      })
      .catch((e) => {
        console.log(e);
        if (e && e.response && e.response.data) return message.error(String(e.response.data));
        message.error(String(e));
      })
      .finally(() => {
        _confirmLoading(false);
      });
  }

  return (
    <div className="App" style={{ padding: '20px' }}>
      <Steps
        direction="vertical"
        progressDot
        current={stepCurrent}
        items={[
          {
            title: (
              <>
                Connect Wallet
                {acc.connector ? (
                  <Tag color="blue">{acc.address}</Tag>
                ) : (
                  <Tag color="red">{conn.isError ? `(${conn.error})` : ''}</Tag>
                )}
              </>
            ),
            description: conn.connectors.map((connector) => (
              <Button
                type={acc.connector?.id === connector.id ? 'primary' : 'default'}
                disabled={!connector.ready}
                key={connector.id}
                onClick={() => conn.connect({ connector })}
                style={{ marginRight: '10px' }}
              >
                {connector.name}
                {conn.isLoading && conn.pendingConnector?.id === connector.id && ' (connecting)'}
              </Button>
            )),
          },
          {
            title: `Network ID: ${net.chain ? `${net.chain.id}` : '...'}`,
          },
          {
            title: 'My Data',
            description: (
              <div style={{ backgroundColor: '#eaeaea', padding: '20px' }}>
                <Row gutter={24}>
                  <Col style={{ marginBottom: '20px', width: '300px' }}>
                    <Button style={{ width: '100%', height: '100%', fontSize: '40px' }} onClick={() => Submit()}>
                      <PlusOutlined />
                    </Button>
                  </Col>
                  {UserKeys.map((key) => (
                    <Col key={key} style={{ marginBottom: '20px', width: '300px' }}>
                      <DataContent update={Submit} address={acc.address!} name={key} />
                    </Col>
                  ))}
                </Row>
              </div>
            ),
          },
        ]}
      />

      <Modal
        wrapClassName="modal-add-data"
        maskClosable={false}
        title="Add a data"
        open={isModalOpen}
        onOk={AddData}
        onCancel={() => _isModalOpen(false)}
        width="auto"
        confirmLoading={confirmLoading}
      >
        <Input
          value={inputKey}
          addonBefore={`_dnslink.${acc.address}.`}
          onChange={(e) => _inputKey(e.target.value)}
          addonAfter={`.${Constants.ipnsDomain}`}
          placeholder="avatar"
        />
        <Input
          value={inputValue}
          onChange={(e) => _inputValue(e.target.value)}
          addonBefore={`dnslink=`}
          placeholder="/ipfs/QmVtHn5JwmPVBvJZsuxdyixjB8yQHaHwsmLtAGXzRUccRA"
          style={{ marginTop: '20px' }}
        />
      </Modal>
    </div>
  );
}

export default App;
