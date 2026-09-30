import React from 'react';
import { createRoot } from 'react-dom/client';
import { CountUp } from '../src/animations';

// Same value shapes the hero stats use, so the parser is exercised realistically.
const VALUES = ['11+', '14+', '100+', '3+'];

createRoot(document.getElementById('root')!).render(
  <div>
    {VALUES.map((v) => (
      <span key={v} data-probe={v}>
        <CountUp value={v} duration={0.4} />
      </span>
    ))}
  </div>,
);
