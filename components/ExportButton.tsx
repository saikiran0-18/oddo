'use client'

import React from 'react';

export const ExportButton = () => {
  return (
    <button 
      onClick={() => window.print()} 
      className="btn btn-primary print-hidden"
    >
      Print / Save PDF
    </button>
  );
};
