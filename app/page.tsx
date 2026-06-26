import { Metadata } from 'next'
import Link from 'next/link'
import { CloudIcon, ShieldCheckIcon, ZapIcon, CopyIcon, UploadCloudIcon, LockKeyholeIcon, ArrowRightIcon } from 'lucide-react'
import '@/lib/bigInt-patch.ts'
export const metadata: Metadata = {
  title: 'CloudVault — Secure, Encrypted Cloud File Storage',
  description:
    'Upload, store, and share files with enterprise-grade SHA-256 encryption, smart deduplication, and lightning-fast chunked uploads.',
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-100 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-blue-300/20 rounded-full mix-blend-multiply blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-300/20 rounded-full mix-blend-multiply blur-3xl" />
      <div className="absolute top-[40%] right-[20%] w-80 h-80 bg-teal-300/15 rounded-full mix-blend-multiply blur-3xl" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 px-4 py-4">
        <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg shadow-blue-900/5 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
              <CloudIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-extrabold text-slate-800 text-xl tracking-tight">CloudVault</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 pt-20 pb-28 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-8">
          <ShieldCheckIcon className="w-4 h-4" />
          Enterprise-grade SHA-256 Encryption
        </div>

        <h2 className="text-6xl sm:text-7xl font-extrabold text-slate-800 tracking-tight leading-tight mb-6">
          Your files.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            Encrypted.
          </span>
          <br />
          Lightning fast.
        </h2>

        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          CloudVault intelligently chunks, encrypts, and deduplicates your files — so you store less,
          upload faster, and keep total control over your data.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-xl shadow-blue-500/25 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/30 transition-all"
          >
            Start Uploading
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold text-slate-700 bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg hover:bg-white hover:-translate-y-1 transition-all"
          >
            Learn More
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-10 mt-16 text-sm font-semibold text-slate-500">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-extrabold text-slate-800">256-bit</span>
            <span>Encryption</span>
          </div>
          <div className="w-px h-10 bg-slate-200" />
          <div className="flex flex-col items-center">
            <span className="text-3xl font-extrabold text-slate-800">99.9%</span>
            <span>Uptime SLA</span>
          </div>
          <div className="w-px h-10 bg-slate-200" />
          <div className="flex flex-col items-center">
            <span className="text-3xl font-extrabold text-slate-800">50%+</span>
            <span>Storage Saved</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-4 pb-28">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-4">
            Built for security.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">
              Designed for speed.
            </span>
          </h3>
          <p className="text-lg text-slate-500 max-w-xl mx-auto font-medium">
            Every file you upload is protected by layers of intelligent engineering.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <article className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-xl shadow-blue-900/5 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <LockKeyholeIcon className="w-7 h-7 text-blue-600" />
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-3">End-to-End Encryption</h4>
            <p className="text-slate-500 leading-relaxed">
              Every chunk is verified with SHA-256 checksums enforced at the storage layer. Tampered data is automatically rejected.
            </p>
          </article>

          {/* Feature 2 */}
          <article className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-xl shadow-blue-900/5 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <CopyIcon className="w-7 h-7 text-purple-600" />
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-3">Smart Deduplication</h4>
            <p className="text-slate-500 leading-relaxed">
              Identical content is stored only once globally. Upload the same file twice and it costs zero extra storage — instantly.
            </p>
          </article>

          {/* Feature 3 */}
          <article className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-xl shadow-blue-900/5 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ZapIcon className="w-7 h-7 text-teal-600" />
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-3">Blazing Fast Uploads</h4>
            <p className="text-slate-500 leading-relaxed">
              Files are chunked and uploaded in parallel directly to the storage layer using pre-signed URLs. No server bottleneck.
            </p>
          </article>
        </div>
      </section>

      {/* How it Works */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 pb-28">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-4">
            How it works
          </h3>
          <p className="text-lg text-slate-500 max-w-xl mx-auto font-medium">
            Three simple steps to secure cloud storage.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 mb-6">
              <UploadCloudIcon className="w-8 h-8 text-white" />
            </div>
            <div className="text-sm font-bold text-blue-600 mb-2">Step 1</div>
            <h4 className="text-lg font-bold text-slate-800 mb-2">Drop Your Files</h4>
            <p className="text-slate-500 text-sm leading-relaxed">
              Drag and drop any file into the dashboard. We handle the rest automatically.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25 mb-6">
              <ShieldCheckIcon className="w-8 h-8 text-white" />
            </div>
            <div className="text-sm font-bold text-purple-600 mb-2">Step 2</div>
            <h4 className="text-lg font-bold text-slate-800 mb-2">Chunk, Hash, Dedupe</h4>
            <p className="text-slate-500 text-sm leading-relaxed">
              Files are split into chunks, hashed with SHA-256, and checked for duplicates before uploading.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/25 mb-6">
              <LockKeyholeIcon className="w-8 h-8 text-white" />
            </div>
            <div className="text-sm font-bold text-teal-600 mb-2">Step 3</div>
            <h4 className="text-lg font-bold text-slate-800 mb-2">Stored Securely</h4>
            <p className="text-slate-500 text-sm leading-relaxed">
              Each chunk is cryptographically verified and stored. Only you can reassemble and download your files.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 text-center shadow-2xl shadow-blue-900/20">
          <h3 className="text-3xl font-extrabold text-white mb-4">
            Ready to secure your files?
          </h3>
          <p className="text-blue-100 text-lg mb-8 max-w-lg mx-auto">
            Join CloudVault and experience file storage the way it should be — fast, secure, and intelligent.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold bg-white text-blue-700 rounded-2xl shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all"
          >
            Get Started Free
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-blue-200/30 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <CloudIcon className="w-4 h-4 text-blue-500" />
            <span>© {new Date().getFullYear()} CloudVault. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-semibold text-slate-400">
            <span className="flex items-center gap-1.5"><span className="text-blue-500">✨</span> Encrypted</span>
            <span className="flex items-center gap-1.5"><span className="text-purple-500">⚡</span> Lightning Fast</span>
            <span className="flex items-center gap-1.5"><span className="text-teal-500">🛡️</span> Zero Knowledge</span>
          </div>
        </div>
      </footer>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'CloudVault',
            url: 'https://cloudvault.app',
            description:
              'Secure, encrypted cloud file storage with smart deduplication and chunked uploads.',
            applicationCategory: 'StorageApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          }),
        }}
      />
    </div>
  )
}
