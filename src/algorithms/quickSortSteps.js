/**
 * Quick Sort steps generator and collector.
 * - Yields/collects steps with array snapshots, comparing indices, and swap flags.
 * - Never mutates the input array; uses a working copy and clones for each step.
 */
export function* quickSortStepsGenerator(inputArray) {
  const arr = Array.isArray(inputArray) ? [...inputArray] : [];
  if (arr.length <= 1) return;

  function* partition(lo, hi) {
    const pivot = arr[hi];
    let i = lo;
    for (let j = lo; j < hi; j += 1) {
      // Compare arr[j] with pivot at hi
      yield { array: [...arr], comparing: [j, hi], swapped: false };
      if (arr[j] < pivot) {
        if (i !== j) {
          const tmp = arr[i];
          arr[i] = arr[j];
          arr[j] = tmp;
          yield { array: [...arr], comparing: [i, j], swapped: true };
        }
        i += 1;
      }
    }
    // place pivot
    if (i !== hi) {
      const tmp = arr[i];
      arr[i] = arr[hi];
      arr[hi] = tmp;
      yield { array: [...arr], comparing: [i, hi], swapped: true };
    }
    return i;
  }

  function* qs(lo, hi) {
    if (lo >= hi) return;
    const p = yield* partition(lo, hi);
    yield* qs(lo, p - 1);
    yield* qs(p + 1, hi);
  }

  yield* qs(0, arr.length - 1);
}

export function quickSortSteps(inputArray) {
  const steps = [];
  const gen = quickSortStepsGenerator(inputArray);
  for (const step of gen) steps.push(step);
  return steps;
}
