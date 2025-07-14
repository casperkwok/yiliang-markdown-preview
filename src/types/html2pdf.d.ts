declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: {
      type?: string;
      quality?: number;
    };
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
      letterRendering?: boolean;
      allowTaint?: boolean;
      backgroundColor?: string | null;
      removeContainer?: boolean;
      imageTimeout?: number;
      logging?: boolean;
      width?: number;
      height?: number;
      scrollX?: number;
      scrollY?: number;
    };
    jsPDF?: {
      unit?: string;
      format?: string;
      orientation?: string;
      compress?: boolean;
      precision?: number;
    };
    pagebreak?: {
      mode?: string[];
      before?: string;
      after?: string;
      avoid?: string[];
    };
  }

  interface Html2PdfWorker {
    set(options: Html2PdfOptions): Html2PdfWorker;
    from(element: HTMLElement): Html2PdfWorker;
    save(): Promise<void>;
    output(type: string): Promise<Blob | string>;
    outputPdf(type?: string): Promise<Blob | string>;
    then(onFulfilled?: (value: unknown) => unknown, onRejected?: (reason: unknown) => unknown): Promise<unknown>;
  }

  function html2pdf(): Html2PdfWorker;

  export = html2pdf;
} 