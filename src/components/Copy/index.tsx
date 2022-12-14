import { Button, DatePicker, DatePickerProps, message, Modal, Popconfirm, Tooltip } from 'antd';
import axios from 'axios';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import Constants from '../../constants';
import { CheckOutlined, LinkOutlined, CopyOutlined } from '@ant-design/icons';
import './index.scss';
export interface ICopyIcon {
  text: string;
  className?: string;
  timeout?: number;
  el?: React.ReactNode;
}

const CopyIcon: React.FC<ICopyIcon> = (props) => {
  const [isCopy, setCopy] = useState(false);

  async function fun() {
    try {
      await navigator.clipboard.writeText(props.text);
      setCopy(true);
      // message.success(`Copied: ${props.text}`);

      setTimeout(() => {
        setCopy(false);
      }, props.timeout || 2000);
    } catch (e) {
      setCopy(false);
    }
  }
  const renderIcon = () => {
    if (isCopy) return <CheckOutlined />;
    if (props.el) return props.el;
    return <CopyOutlined />;
  };
  return (
    <Tooltip title={'Copied'} open={isCopy}>
      <span className={props.className} onClick={fun} style={{ display: 'inline-flex', verticalAlign: '-0.125em' }}>
        {renderIcon()}
      </span>
    </Tooltip>
  );
};

export default CopyIcon;
