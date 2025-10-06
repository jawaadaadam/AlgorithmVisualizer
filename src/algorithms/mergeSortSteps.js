/**
 * Merge Sort steps collector.
 * Emits steps with array snapshots when comparing/placing elements.
 */
export function mergeSortSteps(inputArray) {
  const arr = Array.isArray(inputArray) ? [...inputArray] : [];
  const steps = [];

  function merge(lo, mid, hi) {
    const left = arr.slice(lo, mid + 1);
    const right = arr.slice(mid + 1, hi + 1);
    let i = 0, j = 0, k = lo;

    while (i < left.length && j < right.length) {
      steps.push({ array: [...arr], comparing: [lo + i, mid + 1 + j], swapped: false });
      if (left[i] <= right[j]) {
        arr[k] = left[i];
        i += 1;
      } else {
        arr[k] = right[j];
        j += 1;
      }
      steps.push({ array: [...arr], comparing: [k, k], swapped: true });
      k += 1;
    }

    while (i < left.length) {
      arr[k] = left[i];
      steps.push({ array: [...arr], comparing: [k, k], swapped: true });
      i += 1; k += 1;
    }
    while (j < right.length) {
      arr[k] = right[j];
      steps.push({ array: [...arr], comparing: [k, k], swapped: true });
      j += 1; k += 1;
    }
  }

  function sort(lo, hi) {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    sort(lo, mid);
    sort(mid + 1, hi);
    merge(lo, mid, hi);
  }

  sort(0, arr.length - 1);
  return steps;
}
