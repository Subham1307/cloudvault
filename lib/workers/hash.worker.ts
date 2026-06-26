import { CHUNK_SIZE } from "@/constants/constant";
import type { chunk } from "@/components/dashboard/dashboard";

self.onmessage = async (event) => {
  const { file } = event.data;
  const chunks: chunk[] = [];
  for(let i=0; i<file.size; i+=CHUNK_SIZE) {
    const blob = file.slice(i, i + CHUNK_SIZE);        // grab 4MB slice
    const arrayBuffer = await blob.arrayBuffer();        // read bytes
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer); // hash it
    const hash = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join(''); 

    chunks.push({
      index: i/CHUNK_SIZE,
      hash: hash,
      status: 'pending',
      preSignedUrl: '',
      abortController: new AbortController()
    });
  }

  self.postMessage({ chunks });
};