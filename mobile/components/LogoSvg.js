import React from 'react';
import Svg, { Text, Path, Line } from 'react-native-svg';

const LogoSvg = (props) => (
    <Svg
        width={props.width || 160}
        height={props.height || 40}
        viewBox="0 0 320 60"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Text
            x="10"
            y="40"
            fontSize="32"
            fill="#6A1B9A"
            fontWeight="700"
            fontFamily="Segoe UI"
        >
            Ektu Jha
        </Text>
        {/* Cup shape: only bottom corners rounded, top corners pointy */}
        <Path
            d="
                M136,22
                H164
                V36
                Q164,40 160,40
                H140
                Q136,40 136,36
                Z
            "
            stroke="#6A1B9A"
            strokeWidth={3.5}
            fill="none"
        />
        <Line x1={136} y1={18} x2={136} y2={32} stroke="#6A1B9A" strokeWidth={3.5} strokeLinecap="round" />
        <Line x1={164} y1={29} x2={169} y2={26} stroke="#6A1B9A" strokeWidth={3.5} strokeLinecap="round" />
        {/* More curvy steam, middle one is taller */}
        <Path d="M144,16 C142,8 146,8 144,3" stroke="#C7432F" strokeWidth={3} strokeLinecap="round" fill="none" />
        <Path d="M150,16 C147,4 153,4 150,-2" stroke="#C7432F" strokeWidth={3} strokeLinecap="round" fill="none" />
        <Path d="M156,16 C154,8 158,8 156,3" stroke="#C7432F" strokeWidth={3} strokeLinecap="round" fill="none" />
    </Svg>
);

export default LogoSvg;
