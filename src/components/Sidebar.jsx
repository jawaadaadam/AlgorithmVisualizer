import React from 'react';

export default function Sidebar({ current, onSelect }) {
  const items = [
    { key: 'sorting', label: 'Sorting' },
    { key: 'searching', label: 'Searching' },
  ];
  return (
    <aside className="h-full w-full md:w-64 bg-white/70 backdrop-blur border-r border-gray-200 p-4">
      <nav className="space-y-1">
        {items.map((item) => {
          const active = current === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelect?.(item.key)}
              className={
                `w-full text-left px-3 py-2 rounded-lg transition ` +
                (active
                  ? 'bg-indigo-600 text-white shadow'
                  : 'hover:bg-gray-100 text-gray-700')
              }
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
