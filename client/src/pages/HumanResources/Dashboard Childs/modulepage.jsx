export const HRModulePage = ({ title, description }) => {
  return (
    <div className="h-full p-6 rounded-xl border bg-white shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>
      <p className="mt-2 text-slate-600">{description}</p>
    </div>
  )
}
