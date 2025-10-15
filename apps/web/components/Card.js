export default function Card({ title, children }){
  return <div className="bg-white rounded shadow p-4"><div className="font-medium mb-2">{title}</div>{children}</div>
}
