import type { HeatmapData } from "@/lib/statistiques-utils";

export function Heatmap({ data }: { data: HeatmapData }) {
  if (data.cols.length === 0) {
    return <p className="py-10 text-center text-sm text-muted-foreground">Aucune donnée.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max border-collapse text-xs">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-card p-2 text-left font-medium text-muted-foreground" />
            {data.cols.map((col) => (
              <th
                key={col.key}
                className="whitespace-nowrap p-2 text-center font-medium text-muted-foreground"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr key={row.key}>
              <td className="sticky left-0 z-10 whitespace-nowrap bg-card p-2 font-medium text-foreground">
                {row.label}
              </td>
              {data.cols.map((col, colIndex) => {
                const value = data.matrix[rowIndex][colIndex];
                const intensity = data.max === 0 ? 0 : value / data.max;
                return (
                  <td key={col.key} className="p-1 text-center">
                    <div
                      className="mx-auto flex size-9 items-center justify-center rounded-md font-medium text-foreground"
                      style={{
                        backgroundColor:
                          value === 0
                            ? "transparent"
                            : `color-mix(in oklab, var(--color-chart-5) ${Math.round(
                                15 + intensity * 70,
                              )}%, transparent)`,
                      }}
                    >
                      {value > 0 ? value : ""}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
