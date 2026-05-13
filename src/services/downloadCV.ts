import html2canvas from 'html2canvas';

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * PDF — clones the CV into the SAME document (so all Tailwind styles work),
 * temporarily hides everything else via @media print CSS, triggers print dialog.
 * No new window needed — avoids all cross-origin/blank page issues.
 */
export function downloadAsPDF(el: HTMLElement, filename: string) {
  const CLONE_ID = '__cv_pdf_clone__';
  const STYLE_ID = '__cv_pdf_style__';

  // Remove any leftover clone from a previous call
  document.getElementById(CLONE_ID)?.remove();
  document.getElementById(STYLE_ID)?.remove();

  const clone = el.cloneNode(true) as HTMLElement;
  clone.id = CLONE_ID;
  // Override the off-screen positioning that the source element has
  clone.style.cssText = `
    position: static !important;
    left: 0 !important;
    top: 0 !important;
    width: 794px;
    z-index: auto !important;
    pointer-events: none;
    background: white;
  `;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @media print {
      html, body { margin: 0 !important; padding: 0 !important; background: white !important; }
      body > *:not(#${CLONE_ID}) { display: none !important; visibility: hidden !important; }
      #${CLONE_ID} { display: block !important; visibility: visible !important; position: static !important; width: 100% !important; }
      @page { margin: 0; size: A4 portrait; }
    }
  `;

  document.title = filename;
  document.head.appendChild(style);
  document.body.appendChild(clone);

  // Give the browser one frame to render, then print
  requestAnimationFrame(() => {
    setTimeout(() => {
      window.print();
      // Clean up after the print dialog is dismissed (2 s grace period)
      setTimeout(() => {
        clone.remove();
        style.remove();
      }, 2000);
    }, 150);
  });
}

/**
 * DOC — Word-compatible HTML file downloaded directly.
 * Uses the element's innerHTML content; Word interprets basic HTML.
 */
export function downloadAsDoc(el: HTMLElement, filename: string) {
  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>${filename}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    body  { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.4; }
    h1    { font-size: 18pt; font-weight: bold; margin-bottom: 4pt; }
    h2    { font-size: 13pt; font-weight: bold; margin-top: 10pt; margin-bottom: 3pt; }
    h3    { font-size: 11pt; font-weight: bold; }
    p, li { font-size: 10pt; margin: 2pt 0; }
    @page { margin: 1.5cm; size: A4; }
  </style>
</head>
<body>${el.innerHTML}</body>
</html>`;

  const blob = new Blob(['﻿', html], { type: 'application/msword' });
  triggerDownload(blob, `${filename}.doc`);
}

/**
 * PNG image — temporarily places a visible clone at position 0,0 at full scale,
 * captures with html2canvas at 2× resolution, then removes the clone.
 * This avoids the off-screen / z-index issues with the hidden print element.
 */
export async function downloadAsImage(el: HTMLElement, filename: string) {
  const CLONE_ID = '__cv_img_clone__';
  document.getElementById(CLONE_ID)?.remove();

  const clone = el.cloneNode(true) as HTMLElement;
  clone.id = CLONE_ID;
  clone.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 794px;
    z-index: 99999;
    background: white;
    pointer-events: none;
  `;

  document.body.appendChild(clone);

  // Allow one render frame so html2canvas sees the correct layout
  await new Promise<void>(r => setTimeout(r, 200));

  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: 794,
      height: clone.scrollHeight,
      windowWidth: 794,
    });

    canvas.toBlob(blob => {
      if (blob) triggerDownload(blob, `${filename}.png`);
    }, 'image/png');
  } finally {
    clone.remove();
  }
}
