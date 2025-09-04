declare module 'pdf2txt' {
  function pdf2txt(buffer: Buffer): Promise<string>;
  export = pdf2txt;
} 