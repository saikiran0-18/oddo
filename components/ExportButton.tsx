'use client'

import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const ExportButton = () => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const element = document.getElementById('reportRoot');
      if (!element) throw new Error('Report element not found');
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('TransitOps_Report.pdf');
    } catch (e) {
      console.error(e);
      alert('Failed to export PDF');
    }
    setLoading(false);
  };

  return (
    <button onClick={handleExport} disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem' }}>
      {loading ? 'Generating PDF...' : 'Export PDF'}
    </button>
  );
};
