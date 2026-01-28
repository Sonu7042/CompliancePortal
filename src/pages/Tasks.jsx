import { useState, useEffect } from "react";

const STORAGE_KEY = "compliance_data";

const PERIODICITY_OPTIONS = [
  "Monthly",
  "Quarterly",
  "Half-Yearly",
  "Yearly",
  "2-Yearly",
  "3-Yearly",
  "4-Yearly",
  "5-Yearly",
];

const CompliancePortals = () => {
  const [data, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [editingCell, setEditingCell] = useState({
    rowIndex: null,
    field: null,
  });

  const editableFields = [
    "provision",
    "applicability",
    "responsibility",
    "periodicity",
    "priority",
    "forms",
    "doneDate",
  ];

  const defaultRow = {
    origin: "Factories Act, 1948",
    category: "Labour Law",
    traceability: "Section 7A",
    obligations: "Ensure health, safety and welfare of workers",
    provision: "Safety audit and appointment of safety officer",
    applicability: "Manufacturing units with 10+ workers",
    responsibility: "HR Manager",
    periodicity: "Quarterly",
    priority: "High",
    forms: "Form 21",
    doneDate: "2025-01-10",
    dueDate: "2025-03-31",
    status: "Non-Compliance",
    daysBefore: "80",
    upcoming: "Yes",
    remarks: "Safety audit pending",
  };

  // ===== LOAD =====
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setData(JSON.parse(stored));
    } else {
      setData([defaultRow]);
    }
    setIsLoaded(true);
  }, []);

  // ===== SAVE =====
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isLoaded]);

  // ===== EDIT HANDLERS =====
  const handleDoubleClick = (rowIndex, field) => {
    if (!editableFields.includes(field)) return;
    setEditingCell({ rowIndex, field });
  };

  const handleCellChange = (e, rowIndex, field) => {
    const updated = [...data];
    updated[rowIndex][field] = e.target.value;
    setData(updated);
  };

  const stopEditing = () => {
    setEditingCell({ rowIndex: null, field: null });
  };

  // ===== UI =====
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Compliance Register</h1>

      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full border text-xs">
          <thead className="bg-gray-200 text-center">
            <tr>
              {[
                "S.No",
                "Origin",
                "Category",
                "Traceability",
                "Obligations",
                "Provision",
                "Applicability",
                "Responsibility",
                "Periodicity",
                "Priority",
                "Forms",
                "Done Date",
                "Due Date",
                "Status",
                "Days Before",
                "Upcoming",
                "Remarks",
              ].map((h) => (
                <th key={h} className="border p-2 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-center">
            {data.map((item, index) => (
              <tr key={index}>
                <td className="border p-1">{index + 1}</td>
                <td className="border p-1">{item.origin}</td>
                <td className="border p-1">{item.category}</td>
                <td className="border p-1">{item.traceability}</td>
                <td className="border p-1">{item.obligations}</td>

                {editableFields.map((field) => (
                  <td
                    key={field}
                    className="border p-1 cursor-pointer"
                    onDoubleClick={() =>
                      handleDoubleClick(index, field)
                    }
                  >
                    {editingCell.rowIndex === index &&
                    editingCell.field === field ? (
                      field === "periodicity" ? (
                        // 🔽 PERIODICITY DROPDOWN
                        <select
                          autoFocus
                          value={item[field]}
                          onChange={(e) =>
                            handleCellChange(e, index, field)
                          }
                          onBlur={stopEditing}
                          className="w-full border px-1 text-xs bg-white"
                        >
                          {PERIODICITY_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        // ✏️ NORMAL INPUT
                        <input
                          autoFocus
                          type={
                            field.includes("Date")
                              ? "date"
                              : "text"
                          }
                          value={item[field]}
                          onChange={(e) =>
                            handleCellChange(e, index, field)
                          }
                          onBlur={stopEditing}
                          onKeyDown={(e) =>
                            e.key === "Enter" && stopEditing()
                          }
                          className="w-full border px-1 text-xs"
                        />
                      )
                    ) : (
                      item[field]
                    )}
                  </td>
                ))}

                <td className="border p-1">{item.dueDate}</td>
                <td className="border p-1 text-red-600 font-semibold">
                  {item.status}
                </td>
                <td className="border p-1">{item.daysBefore}</td>
                <td className="border p-1">{item.upcoming}</td>
                <td className="border p-1">{item.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompliancePortals;
