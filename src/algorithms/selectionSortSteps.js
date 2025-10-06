/**
 * Selection Sort steps collector.
 */
export function selectionSortSteps(inputArray) {
  const arr = Array.isArray(inputArray) ? [...inputArray] : [];
  const steps = [];

  for (let i = 0; i < arr.length; i += 1) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j += 1) {
      steps.push({ array: [...arr], comparing: [minIdx, j], swapped: false });
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      const tmp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = tmp;
      steps.push({ array: [...arr], comparing: [i, minIdx], swapped: true });
    }
  }

  return steps;
}
