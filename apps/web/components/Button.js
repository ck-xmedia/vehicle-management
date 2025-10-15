import clsx from 'clsx'
export default function Button({ className, ...props }) {
  return <button {...props} className={clsx('px-3 py-2 rounded bg-blue-600 text-white', className)} />
}
