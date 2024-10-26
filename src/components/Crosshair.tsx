import React from 'react';

export function Crosshair() {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-2 h-2 bg-white rounded-full opacity-50" />
    </div>
  );
}