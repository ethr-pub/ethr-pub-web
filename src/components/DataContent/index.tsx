import { Button, Card, DatePicker, DatePickerProps, message, Modal, Popconfirm } from 'antd';
import axios from 'axios';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import Constants from '../../constants';
import {
  LoadingOutlined,
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  DownloadOutlined,
  FileImageOutlined,
  FileOutlined,
  FileJpgOutlined,
  FileTextOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import './index.scss';
import CopyIcon from '../Copy';
import { useAccount, useSigner } from 'wagmi';
import { useIpfsGateway } from '../../lib/useIpfsGateway';

export interface IDataContent {
  address: string;
  name: string;
  update: (name: string) => any;
  content?: string;
}

const DataContent: React.FC<IDataContent> = (props) => {
  const acc = useAccount();
  const signer = useSigner();
  const last = useRef('');
  const gateway = useIpfsGateway();
  const [loading, _loading] = useState(true);
  const [data, _data] = useState({
    status: 0,
    'content-type': '' as string | undefined,
    'content-length': 0 as number,
    'x-ipfs-path': '' as string | undefined,
    'x-ipfs-roots': '' as string | undefined,
    data: null as any,
  });
  const urls = [`${gateway.current}/ipns/${props.address}`, props.name, Constants.ipnsDomain];
  const url = urls.join('.').replace(/\.\./, '.');
  useEffect(() => {
    update();
  }, [url]);

  async function update() {
    if (!props.address) return;
    if (last.current === url) return; // repeat
    _loading(true);
    last.current = url;
    const lastURL = url;
    console.log(props.name, last.current);
    axios
      .get(url)
      .then((res) => {
        if (lastURL !== last.current) return;
        const result = {
          status: res.status,
          'content-length': parseInt(res.headers['content-length'] || '0'),
          'content-type': res.headers['content-type'],
          'x-ipfs-path': res.headers['x-ipfs-path'],
          'x-ipfs-roots': res.headers['x-ipfs-roots'],
          data: res.data,
        };
        console.log(props.name, res, result);
        _data(result);
      })
      .finally(() => {
        _loading(false);
        last.current = '';
      });
  }

  const download = () => {
    axios
      .get(url, { responseType: 'blob' })
      .then(function (res) {
        var blob = res.data;
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = function (e) {
          var a = document.createElement('a');
          a.download = props.name;
          a.href = e.target!.result as string;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        };
      })
      .catch((e) => {
        message.error(String(e));
      });
  };

  const deleteCard = async () => {
    if (!signer.data) return;
    const req = {
      action: 'delete-my-data',
      address: acc.address,
      data: {
        time: new Date().toString(),
        key: props.name,
        authMessage: '',
      },
    };
    req.data.authMessage = await signer.data.signMessage(
      [
        `domain: https://${Constants.ipnsDomain}`,
        `time: ${req.data.time}`,
        `action: delete`,
        `key: ${req.data.key}`,
      ].join('\r\n\n'),
    );
    const post = await axios.post(`${Constants.API}`, req);
  };

  const body = () => {
    if (loading) return <LoadingOutlined />;
    if (data['content-type'] === 'image/png') return <img title={data['x-ipfs-path']} src={url} />;
    return <iframe style={{ border: 'none' }} src={url} />;
  };
  // <FileImageOutlined />
  // <FileOutlined />
  // <FileTextOutlined />
  return (
    <Card
      className="key-card"
      title={props.name}
      bordered={false}
      extra={
        <>
          <EditOutlined onClick={() => props.update(props.name)} className="icon-edit" style={{ color: 'blue' }} />
          <DownloadOutlined onClick={download} className="icon-download" style={{ color: 'green' }} />
          {props.content ? <CopyIcon className="icon-copy" text={props.content} /> : null}
          <CopyIcon className="icon-copy" el={<LinkOutlined />} text={url} />
          <Popconfirm
            title="Are you sure to delete this item?"
            onConfirm={deleteCard}
            // onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined className="icon-delete" style={{ color: 'red' }} />
          </Popconfirm>
          <ReloadOutlined onClick={update} className="icon-copy" style={{ color: 'green' }} />
        </>
      }
    >
      {body()}
    </Card>
  );
};

export default DataContent;
