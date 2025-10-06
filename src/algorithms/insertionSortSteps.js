/**
 * Insertion Sort steps collector.
 */
export function insertionSortSteps(inputArray) {
  const arr = Array.isArray(inputArray) ? [...inputArray] : [];
  const steps = [];

  for (let i = 1; i < arr.length; i += 1) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      steps.push({ array: [...arr], comparing: [j, j + 1], swapped: true });
      arr[j + 1] = arr[j];
      j -= 1;
    }
    arr[j + 1] = key;
    steps.push({ array: [...arr], comparing: [j + 1, i], swapped: true });
  }

  return steps;
}
