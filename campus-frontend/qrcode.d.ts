declare module 'qrcode' {
    export function toDataURL(
      text: string,
      options: any,
      callback: (err: Error | null, url: string | undefined) => void
    ): void;
    export function toDataURL(
      text: string,
      options?: any
    ): Promise<string>;
  }