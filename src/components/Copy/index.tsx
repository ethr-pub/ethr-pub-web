import { Button, DatePicker, DatePickerProps, message, Modal, Popconfirm, Tooltip } from 'antd';
import axios from 'axios';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import Constants from '../../constants';
import { CheckOutlined, CheckCircleOutlined, CopyOutlined } from '@ant-design/icons';
import './index.scss';
export interface ICopyIcon {
  text: string;
  className?: string;
  timeout?: number;
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
  return (
    <Tooltip title={'Copied'} open={isCopy}>
      <span className={props.className} onClick={fun} style={{ display: 'inline-flex', verticalAlign: '-0.125em' }}>
        {isCopy ? <CheckOutlined /> : <CopyOutlined />}
      </span>
    </Tooltip>
  );
};

export default CopyIcon;
