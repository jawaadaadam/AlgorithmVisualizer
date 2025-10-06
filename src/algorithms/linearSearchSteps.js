/**
 * Generate Linear Search steps for visualization.
 * Each step contains the array snapshot, the compared index, and whether it matched the target.
 * This implementation never mutates the input array; it returns new array copies per step.
 *
 * @param {number[]} inputArray
 * @param {number} target
 * @returns {Array<{ array: number[]; comparing: [number]; found: boolean }>} steps
 */
export function linearSearchSteps(inputArray, target) {
  const arr = Array.isArray(inputArray) ? [...inputArray] : [];
  const steps = [];

  for (let i = 0; i < arr.length; i += 1) {
    const snapshot = [...arr];
    const isMatch = snapshot[i] === target;
    steps.push({ array: snapshot, comparing: [i], found: isMatch });
    if (isMatch) break;
  }

  return steps;
}
