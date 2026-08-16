import { StyleSheet, Text, View } from "react-native";
import Svg, {
  Circle,
  Line,
  Polyline,
  Text as SvgText,
} from "react-native-svg";

import { colors } from "../theme/colors";

export default function SimpleLineChart({
  title,
  data = [],
  dataKey = "close",
  valuePrefix = "$",
}) {
  const chartWidth = 320;
  const chartHeight = 180;
  const padding = 28;

  const chartData = data
    .filter((item) => item[dataKey] !== null && item[dataKey] !== undefined)
    .map((item) => ({
      date: item.date,
      value: Number(item[dataKey]),
    }))
    .filter((item) => !Number.isNaN(item.value));

  if (chartData.length < 2) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.emptyText}>Not enough chart data available.</Text>
      </View>
    );
  }

  const values = chartData.map((item) => item.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const valueRange = maxValue - minValue || 1;

  const points = chartData.map((item, index) => {
    const x =
      padding +
      (index / (chartData.length - 1)) * (chartWidth - padding * 2);

    const y =
      padding +
      ((maxValue - item.value) / valueRange) * (chartHeight - padding * 2);

    return {
      x,
      y,
      value: item.value,
      date: item.date,
    };
  });

  const polylinePoints = points.map((point) => `${point.x},${point.y}`).join(" ");

  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  const formatValue = (value) => {
    return `${valuePrefix}${Number(value).toFixed(2)}`;
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.chartWrapper}>
        <Svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          <Line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={chartHeight - padding}
            stroke="#e5e7eb"
            strokeWidth="1"
          />

          <Line
            x1={padding}
            y1={chartHeight - padding}
            x2={chartWidth - padding}
            y2={chartHeight - padding}
            stroke="#e5e7eb"
            strokeWidth="1"
          />

          <Line
            x1={padding}
            y1={padding}
            x2={chartWidth - padding}
            y2={padding}
            stroke="#f3f4f6"
            strokeWidth="1"
          />

          <Line
            x1={padding}
            y1={chartHeight / 2}
            x2={chartWidth - padding}
            y2={chartHeight / 2}
            stroke="#f3f4f6"
            strokeWidth="1"
          />

          <Polyline
            points={polylinePoints}
            fill="none"
            stroke={colors.primary}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <Circle cx={firstPoint.x} cy={firstPoint.y} r="4" fill={colors.muted} />
          <Circle cx={lastPoint.x} cy={lastPoint.y} r="5" fill={colors.primary} />

          <SvgText
            x={padding}
            y={18}
            fontSize="10"
            fill="#6b7280"
          >
            {formatValue(maxValue)}
          </SvgText>

          <SvgText
            x={padding}
            y={chartHeight - 6}
            fontSize="10"
            fill="#6b7280"
          >
            {formatValue(minValue)}
          </SvgText>
        </Svg>
      </View>

      <View style={styles.chartFooter}>
        <View>
          <Text style={styles.footerLabel}>Start</Text>
          <Text style={styles.footerValue}>{formatValue(firstPoint.value)}</Text>
        </View>

        <View style={styles.footerRight}>
          <Text style={styles.footerLabel}>Latest</Text>
          <Text style={styles.footerValue}>{formatValue(lastPoint.value)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },

  title: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 12,
  },

  chartWrapper: {
    alignItems: "center",
  },

  chartFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  footerLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 3,
  },

  footerValue: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "900",
  },

  footerRight: {
    alignItems: "flex-end",
  },

  emptyText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
});