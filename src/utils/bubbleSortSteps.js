/**
 * Generate Bubble Sort steps for visualization.
 * Each step contains the current array snapshot, the compared indices, and whether a swap occurred.
 * This implementation never mutates the input array; it returns new array copies per step.
 *
 * @param {number[]} inputArray
 * @returns {Array<{ array: number[]; comparing: [number, number]; swapped: boolean }>} steps
 */
export function bubbleSortSteps(inputArray) {
  const arr = Array.isArray(inputArray) ? [...inputArray] : [];
  const steps = [];
  const n = arr.length;

  if (n <= 1) {
    return steps; // nothing to compare
  }

  // Standard bubble sort outer and inner loops
  for (let pass = 0; pass < n - 1; pass += 1) {
    let swappedInPass = false;
    for (let j = 0; j < n - 1 - pass; j += 1) {
      const i = j;
      const k = j + 1;

      // Record comparison before potential swap; snapshot must reflect pre-swap state.
      const beforeCompare = [...arr];
      let didSwap = false;
      if (arr[i] > arr[k]) {
        // perform swap on working array
        const temp = arr[i];
        arr[i] = arr[k];
        arr[k] = temp;
        didSwap = true;
        swappedInPass = true;
      }

      // Push step with array reflecting the state AFTER the comparison and potential swap,
      // but ensure we don't mutate the step array later by cloning.
      const snapshot = didSwap ? [...arr] : beforeCompare;
      steps.push({ array: snapshot, comparing: [i, k], swapped: didSwap });
    }

    // Optimization: if no swaps in a pass, array is sorted
    if (!swappedInPass) {
      break;
    }
  }

  return steps;
}
