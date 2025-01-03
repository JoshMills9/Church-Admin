import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Svg, Path } from 'react-native-svg';

const InvertedSemiCircularProgressBar = ({high, low, stats,attendancePercentage, present, percentage, radius, strokeWidth }) => {
  const WindowWidth = useWindowDimensions().width

  const center = radius;
  const offset = 10; // Padding around the SVG container
  const adjustedRadius = radius; // Use the same radius for both arcs

  // Calculate the clamped percentage for the white progress arc
  const progressPercentage = Math.min(Math.max(present / percentage, 0), 1) * 100;

  // Calculate the angle in radians for the arcs
  const progressAngle = (progressPercentage / 100) * Math.PI; // Radians for the white progress arc

  // The background arc (blue) will always be 180 degrees (π radians)
  const backgroundAngle = Math.PI; // Fixed to 180 degrees for the blue background arc

  const endXProgress = center + adjustedRadius * Math.cos(progressAngle - Math.PI); // End point X for white arc
  const endYProgress = center + adjustedRadius * Math.sin(progressAngle - Math.PI); // End point Y for white arc

  const endXBackground = center + adjustedRadius * Math.cos(backgroundAngle - Math.PI); // End point X for blue arc
  const endYBackground = center + adjustedRadius * Math.sin(backgroundAngle - Math.PI); // End point Y for blue arc

  // Define the path for the background (blue) arc
  const backgroundArcPath = `M${center - adjustedRadius + 2} ${center} ` +
                            `A${adjustedRadius} ${adjustedRadius} 0 0 1 ${center + adjustedRadius} ${center}`;

  // Define the path for the progress (white) arc if present > 0
  const progressArcPath =
    present > 0
      ? `M${center - adjustedRadius + 2} ${center} ` +
        `A${adjustedRadius} ${adjustedRadius} 0 0 1 ${endXProgress} ${endYProgress + 15}`
      : '';

  return (
    <View style={styles.container}>
      <Svg
        width={radius * 2 + offset * 30} // Full diameter + padding for the SVG container
        height={radius + offset} // Full diameter + padding for the height
        viewBox={`0 0 ${radius * 2 + offset * 2} ${radius + offset * 2}`} // Adjust viewBox for the added margin
        style={styles.svg}
      >
        {/* Background Arc (blue stable arc representing total percentage) */}
        <Path
          d={backgroundArcPath}
          fill="none"
          stroke="rgba(41, 128, 185, 1)" // Blue color for the background arc
          strokeLinecap="round"
          strokeLinejoin='round'
          strokeWidth={strokeWidth}
        />

        {/* Conditionally render the Progress Arc (white) if present > 0 */}
        {present > 0 && (
          <Path
            d={progressArcPath}
            fill="none"
            stroke="white" // White color for the progress arc
            strokeWidth={strokeWidth}
            strokeLinejoin='round'
            strokeLinecap="round" // Round the edges
          />
        )}
      </Svg>

      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 15, width: "100%", marginBottom: 10, alignItems: "center" }}>
        <Text style={{ color: "white" }}>{high}</Text>
        <Text style={{ color: "rgba(60, 208, 245, 1)", marginRight:15}}>{low}</Text>
      </View>

      {/* Percentage Text */}
      <View style={[styles.textContainer,{ right: WindowWidth > 400 ? (stats === "Members" ? 150 : 135) : (stats === "Members" ? 140 : 125) }]}>
        <Text style={styles.percentageText}>{stats === "Members" ? percentage : (percentage&&present ?  (Math.min(Math.max(present / percentage, 0), 1) * 100).toFixed(0) :0)+"%"}</Text>
        <Text style={{ fontSize: 15, textAlign: "center", fontWeight: "400", color: "rgba(240, 240, 240, 0.6)" }}>
          {stats}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginLeft: 10
  },
  svg: {
    overflow: 'visible', // Ensures no clipping of the arc or semi-circle
  },
  textContainer: {
    position: 'absolute',
    bottom: 23,
  },
  percentageText: {
    fontSize: 45,
    fontWeight: 'bold',
    color: "white",
    textAlign: "center",
  },
});

export default InvertedSemiCircularProgressBar;
