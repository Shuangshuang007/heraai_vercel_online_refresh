declare module 'pdf-text-extract' {
  function pdfTextExtract(buffer: Buffer): Promise<string[]>;
  export = pdfTextExtract;
} 