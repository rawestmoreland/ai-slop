import Pocketbase from 'pocketbase';

let pb: Pocketbase | null = null;

export function getPbClient(): Pocketbase {
  if (!pb) {
    pb = new Pocketbase(
      import.meta.env.VITE_PUBLIC_PB_URL ?? 'http://localhost:8080',
    );
  }
  return pb;
}
