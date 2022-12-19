import { PatchBank } from "./patch-bank";

/**
 * Load a patch bank from a .syx file.
 *
 * @param file - The file to process as a .syx
 * @returns A promise of maybe a PatchBank
 */
export function loadSyx(file: File): Promise<PatchBank | null> {
  return new Promise((resolve, reject) => {
    const bankName = file.name.replace(".syx", "").replace(".SYX", "");
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      const data = event.target?.result as ArrayBuffer;
      if (!data) resolve(null);
      if (PatchBank.validate(data)) {
        resolve(new PatchBank(bankName, new Uint8Array(data)));
      }
    });
    reader.addEventListener("error", (error) => {
      reject(error);
    });
    reader.readAsArrayBuffer(file);
  });
}
