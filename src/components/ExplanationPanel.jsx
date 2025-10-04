import React from 'react';

export default function ExplanationPanel({ step, isFinished }) {
  let message = '';

  if (isFinished) {
    message = 'Array is sorted!';
  } else if (!step) {
    message = 'Press Play to start sorting.';
  } else if (step && Array.isArray(step.comparing)) {
    const [i, j] = step.comparing;
    const x = step.array[i];
    const y = step.array[j];
    if (step.swapped) {
      message = `Swapped ${x} and ${y}.`;
    } else {
      message = `Comparing ${x} and ${y}. No swap needed.`;
    }
  } else {
    message = 'Ready.';
  }

  return (
    <div className="w-full flex justify-end mt-4">
      <div className="max-w-sm bg-blue-50 text-blue-900 border border-blue-200 rounded-2xl px-4 py-3 shadow-sm">
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
