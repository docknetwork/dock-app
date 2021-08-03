import React, {useEffect, useState} from 'react';
import {jsx as _jsx} from 'react/jsx-runtime';
import {PolkadotUIRpc} from '@docknetwork/react-native-sdk/src/client/polkadot-ui-rpc';
import {Circle, Svg} from 'react-native-svg';

function renderCircle({cx, cy, fill, r}, key) {
  return <Circle cx={cx} cy={cy} fill={fill} r={r} key={key} />;
}

function Identicon({
  address,
  className = '',
  isAlternative = false,
  size,
  style,
}) {
  const [svgData, setSvgData] = useState();

  useEffect(() => {
    PolkadotUIRpc.getPolkadotSvgIcon(address, isAlternative).then(setSvgData);
  }, [address, isAlternative]);

  if (!svgData) {
    return null;
  }

  return (
    <Svg
      className={className}
      height={size}
      id={address}
      name={address}
      style={style}
      viewBox="0 0 64 64"
      width={size}>
      {svgData.map(renderCircle)}
    </Svg>
  );
}

export const PolkadotIcon = React.memo(Identicon);
