export function DataPanel({ title, action, children, className = '' }) {
  return (
    <section className={`glass rounded-lg p-4 ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-white">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

