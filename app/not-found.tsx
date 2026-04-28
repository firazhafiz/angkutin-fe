import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h2 className="text-2xl font-bold mb-4">Not Found</h2>
      <p className="mb-6 text-zinc-600">Could not find requested resource</p>
      <Link
        href="/"
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800"
      >
        Return Home
      </Link>
    </div>
  )
}
