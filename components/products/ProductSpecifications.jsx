import { formatSpecLabel, hasSpecifications } from "@/lib/product-specs";

export default function ProductSpecifications({ specifications, description, model }) {
  const showSpecs = hasSpecifications(specifications);

  if (!showSpecs && !description && !model) return null;

  return (
    <div className="space-y-6">
      {model && (
        <p className="text-sm text-slate-500">
          <span className="font-medium text-slate-700">Model:</span> {model}
        </p>
      )}

      {showSpecs ? (
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900 mb-4">
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
                    <th className="w-2/5 px-4 py-3 text-left font-medium text-slate-700 border-b border-slate-100 align-top">
                      {formatSpecLabel(key)}
                    </th>
                    <td className="px-4 py-3 text-slate-600 border-b border-slate-100">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : description ? (
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900 mb-3">
            Product Details
          </h2>
          <p className="text-slate-600 leading-relaxed">{description}</p>
        </div>
      ) : null}
    </div>
  );
}
