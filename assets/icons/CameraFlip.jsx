import * as React from "react";
import Svg, { Path, Circle } from "react-native-svg";

const CameraFlip = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth={props.StrokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 1 }} {...props}>
    <Path d="M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5m4 0h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5" />
    <Circle cx="12" cy="12" r="3" />
    <Path d="m18 22l-3-3l3-3M6 2l3 3l-3 3" />
  </Svg>
);

export default CameraFlip;
