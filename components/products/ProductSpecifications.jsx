import { formatSpecLabel, hasSpecifications } from "@/lib/product-specs";
import { cn } from "@/lib/utils";

export default function ProductSpecifications({
  specifications,
  description,
  model,
  className,
}) {
  const showSpecs = hasSpecifications(specifications);

  if (!showSpecs && !description && !model) return null;

  return (
    <div className={cn("space-y-4", className)}>
      {model && (
        <p className="text-sm text-slate-500">
          <span className="font-medium text-slate-700">Model:</span> {model}
        </p>
      )}

      {showSpecs ? (
        <div>
          <h2 className="font-display text-lg font-bold text-slate-900 mb-3">
            Specifications
          </h2>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(specifications).map(([key, value], index) => (
                  <tr
                    key={key}
                    className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                  >
                    <th className="w-[38%] px-3 py-2.5 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-slate-700 border-b border-slate-100 align-top">
                      {formatSpecLabel(key)}
                    </th>
                    <td className="px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-slate-600 border-b border-slate-100">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {description && (
            <p className="text-sm text-slate-600 leading-relaxed mt-4">{description}</p>
          )}
        </div>
      ) : description ? (
        <div>
          <h2 className="font-display text-lg font-bold text-slate-900 mb-3">
            Product Details
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
        </div>
      ) : null}
    </div>
  );
}
