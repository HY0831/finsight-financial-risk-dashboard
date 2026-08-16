import { View } from "react-native";
import Svg, { Circle, Polyline, Text as SvgText } from "react-native-svg";

import { useAppTheme } from "../theme/ThemeContext";

export default function SimpleLineChart({ data = [], height = 180 }) {
  const { colors } = useAppTheme();

  const width = 310;

  if (!data || data.length < 2) {
    return <View style={{ height }} />;
  }

  const cleanData = data
    .map((item) => Number(item.close))
    .filter((value) => !Number.isNaN(value));

  if (cleanData.length < 2) {
    return <View style={{ height }} />;
  }

  const maxValue = Math.max(...cleanData);
  const minValue = Math.min(...cleanData);
  const range = maxValue - minValue || 1;

  const points = cleanData
    .map((value, index) => {
      const x = (index / (cleanData.length - 1)) * width;
      const y = height - ((value - minValue) / range) * (height - 40) - 20;

      return `${x},${y}`;
    })
    .join(" ");

  const firstPointY =
    height - ((cleanData[0] - minValue) / range) * (height - 40) - 20;

  const lastPointY =
    height -
    ((cleanData[cleanData.length - 1] - minValue) / range) * (height - 40) -
    20;

  return (
    <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
      <SvgText
        x="0"
        y="14"
        fontSize="11"
        fontWeight="700"
        fill={colors.muted}
      >
        High {maxValue.toFixed(2)}
      </SvgText>

      <SvgText
        x="0"
        y={height - 4}
        fontSize="11"
        fontWeight="700"
        fill={colors.muted}
      >
        Low {minValue.toFixed(2)}
      </SvgText>

      <Polyline
        points={points}
        fill="none"
        stroke={colors.primary}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <Circle cx="0" cy={firstPointY} r="4" fill={colors.primary} />
      <Circle cx={width} cy={lastPointY} r="4" fill={colors.primary} />
    </Svg>
  );
}