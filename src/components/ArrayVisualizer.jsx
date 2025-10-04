import React from 'react';
// Using JSDoc for prop typing instead of PropTypes to avoid extra dependency

/**
 * ArrayVisualizer
 * - Displays an array of numbers as vertical bars.
 * - Bars are bottom-aligned using flexbox.
 * - Supports optional highlighting for comparing and swapped indices.
 *
 * @param {Object} props
 * @param {number[]} props.array - Array of numeric values to visualize.
 * @param {number} [props.maxValue] - Optional max value to scale heights.
 * @param {number[]} [props.comparingIndices] - Indices to highlight in comparing color.
 * @param {number[]} [props.swappedIndices] - Indices to highlight in swapped color.
 * @param {number} [props.height]
 * @param {string} [props.barColor]
 * @param {string} [props.comparingColor]
 * @param {string} [props.swappedColor]
 * @param {number} [props.gap]
 * @param {number} [props.padding]
 * @param {number} [props.borderRadius]
 */
export default function ArrayVisualizer({
  array,
  maxValue,
  comparingIndices = [],
  swappedIndices = [],
  height = 240,
  barColor = '#3b82f6', // blue-500
  comparingColor = '#ef4444', // red-500
  swappedColor = '#22c55e', // green-500
  gap = 4,
  padding = 8,
  borderRadius = 4,
}) {
  const safeArray = Array.isArray(array) ? array : [];
  const computedMax = Math.max(1, maxValue ?? Math.max(0, ...safeArray));

  const isComparing = (index) => comparingIndices.includes(index);
  const isSwapped = (index) => swappedIndices.includes(index);

  const containerStyle = {
    display: 'flex',
    alignItems: 'flex-end',
    gap: `${gap}px`,
    padding: `${padding}px`,
    height: `${height}px`,
    boxSizing: 'border-box',
  };

  const barBaseStyle = {
    flex: 1,
    backgroundColor: barColor,
    borderTopLeftRadius: `${borderRadius}px`,
    borderTopRightRadius: `${borderRadius}px`,
    transition: 'height 150ms ease, background-color 150ms ease',
    minWidth: 0, // allow many bars; they'll shrink
  };

  return (
    <div style={containerStyle}>
      {safeArray.map((value, index) => {
        const heightPercent = (value / computedMax) * 100;
        const isCmp = isComparing(index);
        const isSwp = isSwapped(index);
        const backgroundColor = isCmp
          ? comparingColor
          : isSwp
          ? swappedColor
          : barColor;

        return (
          <div
            key={index}
            style={{
              ...barBaseStyle,
              height: `${heightPercent}%`,
              backgroundColor,
            }}
            title={`index ${index}: ${value}`}
          />
        );
      })}
    </div>
  );
}
