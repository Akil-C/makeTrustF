/**
 * Generic page placeholder used during development.
 * Replace with actual page implementation.
 */
export default function PageStub({ name = 'Page' }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-2xl mb-2">🚧</p>
        <p className="text-gray-500 font-medium">{name} — coming soon</p>
      </div>
    </div>
  )
}
