import { chunk } from "@/lib/types";

export function hashFileWithWorker(file: File) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(new URL('@/lib/workers/hash.worker.ts', import.meta.url));
        worker.postMessage({ file });
        worker.onmessage = (event: MessageEvent<{ chunks: chunk[] }>) => {
            worker.terminate();
            resolve(event.data.chunks);
        }
        worker.onerror = (event) => {
            worker.terminate();
            reject(event);
        }
    });
}