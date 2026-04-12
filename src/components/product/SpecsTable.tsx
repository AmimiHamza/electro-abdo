interface SpecsTableProps {
  specs: Record<string, string>;
}

export function SpecsTable({ specs }: SpecsTableProps) {
  const entries = Object.entries(specs);
  if (entries.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <tbody>
          {entries.map(([key, value], i) => (
            <tr
              key={key}
              className={i % 2 === 0 ? "bg-muted/40" : "bg-surface"}
            >
              <td className="px-4 py-2.5 font-medium text-muted-foreground w-2/5 border-e border-border">
                {key}
              </td>
              <td className="px-4 py-2.5 text-foreground">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
