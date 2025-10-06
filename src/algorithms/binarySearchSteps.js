/**
 * Binary Search steps collector (on a sorted array).
 * Each step records mid comparison; found is true when target equals mid.
 */
export function binarySearchSteps(inputArray, target) {
  const arr = Array.isArray(inputArray) ? [...inputArray] : [];
  const steps = [];
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    steps.push({ array: [...arr], comparing: [mid], found: arr[mid] === target });
    if (arr[mid] === target) break;
    if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;
  }
  return steps;
}
