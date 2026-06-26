import { chunk } from "@/lib/types"

const WINDOW_SIZE = 48
const BASE = 257
const MOD = 2 ** 32

// Precompute BASE^(WINDOW_SIZE-1) mod MOD — needed for rolling out old byte
const BASE_POW = modpow(BASE, WINDOW_SIZE - 1, MOD)

// Mask determines average chunk size
// (1 << 22) - 1 = ~4MB average
const MASK = (1 << 22) - 1
const MIN_CHUNK = 2 * 1024 * 1024   // 2MB
const MAX_CHUNK = 8 * 1024 * 1024   // 8MB

function modpow(base: number, exp: number, mod: number): number {
    let result = 1
    base = base % mod
    while (exp > 0) {
        if (exp % 2 === 1) result = (result * base) % mod
        exp = Math.floor(exp / 2)
        base = (base * base) % mod
    }
    return result
}

// function returns a pair of int {start, end} of the chunk
function findChunkBoundaries(buffer: Uint8Array): { start: number, end: number }[] {
    const chunkBoundaries: { start: number, end: number }[] = []
    let hash = 0;
    let start = 0;
    for (let i = 0; i < buffer.length; i++) {
        let outByte = i >= WINDOW_SIZE ? buffer[i - WINDOW_SIZE] : 0;
        let inByte = buffer[i];
        hash = ((hash - (outByte * BASE_POW) % MOD + MOD) * BASE + inByte) % MOD;
        if (i - start + 1 >= MAX_CHUNK) {
            chunkBoundaries.push({ start: start, end: i });
            start = i + 1;
            hash = 0;
            continue;
        }
        if (i - start + 1 >= MIN_CHUNK && (hash & MASK) === 0 && i - start + 1 <= MAX_CHUNK) {
            chunkBoundaries.push({ start: start, end: i });
            start = i + 1;
            hash = 0;
        }

    }
    if (start < buffer.length) {
        chunkBoundaries.push({ start: start, end: buffer.length - 1 });
    }
    return chunkBoundaries;
}

self.onmessage = async (event) => {
    const { file } = event.data;
    const buffer = new Uint8Array(await file.arrayBuffer())
    const boundaries = findChunkBoundaries(buffer)

    const chunks: chunk[] = [];

    for (const boundary of boundaries) {
        const chunk = buffer.slice(boundary.start, boundary.end + 1);
        const hashBuffer = await crypto.subtle.digest('SHA-256', chunk);
        const hash = Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        chunks.push({
            start: boundary.start,
            end: boundary.end,
            hash: hash,
            status: 'pending',
            preSignedUrl: '',
        });
    }

    self.postMessage({ chunks });
};