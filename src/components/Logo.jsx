export default function Logo({ small = false }) {
  return (
    <span className={`font-bold ${small ? 'text-lg' : 'text-xl'} text-gray-900 whitespace-nowrap`}>
      Crodyto
    </span>
  )
}
