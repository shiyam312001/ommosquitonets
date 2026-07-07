import { formatSpecLabel, hasSpecifications } from "@/lib/category-specs";
import { cn } from "@/lib/utils";

export default function CategorySpecifications({ specifications, className }) {
  if (!hasSpecifications(specifications)) return null;

  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="font-display text-xl font-bold text-slate-900">
        Specifications
      </h2>
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm">
        <table className="w-full text-sm">
          <tbody>
            {Object.entries(specifications).map(([key, value], index) => (
              <tr
                key={key}
                className={index % 2 === 0 ? "bg-white" : "bg-slate-50/80"}
              >
                <th className="w-[38%] px-4 py-3.5 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-slate-700 border-b border-slate-100 align-top">
                  {formatSpecLabel(key)}
                </th>
                <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-xs sm:text-sm text-slate-600 border-b border-slate-100 leading-relaxed">
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
