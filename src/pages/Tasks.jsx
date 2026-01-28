import { useState, useEffect } from "react";

const STORAGE_KEY = "compliance_data";

const ComplianceRegister = () => {
  // ================= STATES =================
  const [showForm, setShowForm] = useState(false);
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
    provision: "Safety audit and officer appointment",
    applicability: "10+ Workers",
    responsibility: "HR Manager",
    periodicity: "Annual",
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

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white w-full max-w-5xl p-6 rounded shadow overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">Add Compliance</h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm"
            >
              {Object.keys(initialState).map((key) =>
                key === "remarks" ||
                key === "provision" ||
                key === "obligations" ? (
                  <textarea
                    key={key}
                    name={key}
                    value={form[key]}
                    placeholder={key.replace(/([A-Z])/g, " $1")}
                    className="input md:col-span-3"
                    onChange={handleChange}
                  />
                ) : (
                  <input
                    key={key}
                    name={key}
                    value={form[key]}
                    type={key.includes("Date") ? "date" : "text"}
                    placeholder={key.replace(/([A-Z])/g, " $1")}
                    className="input"
                    onChange={handleChange}
                  />
                ),
              )}

              <div className="md:col-span-3 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Save Compliance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, variant }) => {
  const styles = {
    primary: "text-indigo-600 bg-indigo-50 border-indigo-100",
    success: "text-emerald-600 bg-emerald-50 border-emerald-100",
    danger: "text-rose-600 bg-rose-50 border-rose-100",
    warning: "text-amber-600 bg-amber-50 border-amber-100"
  };

  return (
    <div className="bg-white dark:bg-[#0f0f0f] p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${styles[variant]}`}>
        <Icon size={24} />
      </div>
      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-2">{label}</p>
      <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">{value}</h3>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    "Overdue": "text-rose-600 bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-900/30",
    "Due Today": "text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30",
    "In Progress": "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30"
  };

  return (
    <div className={`inline-flex px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}>
      {status}
    </div>
  );
};

const EditableText = ({ value, onSave, className, icon: Icon }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(currentValue);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-1">
        <input
          autoFocus
          className="bg-white dark:bg-gray-800 border border-indigo-500 rounded px-2 py-1 text-sm outline-none w-full dark:text-white"
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={handleSubmit}
        />
      </form>
    );
  }

  return (
    <div
      className={`cursor-pointer group/item relative ${className}`}
      onClick={() => setIsEditing(true)}
    >
      {Icon && <Icon size={14} className="inline mr-2 text-gray-300" />}
      {value}
      <Edit2 size={10} className="inline ml-2 text-indigo-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
    </div>
  );
};

const EditableSelect = ({ value, options, onChange, className }) => {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <select
        autoFocus
        className="text-[10px] font-black uppercase tracking-widest bg-white dark:bg-gray-800 border border-indigo-500 rounded outline-none p-1"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsEditing(false);
        }}
        onBlur={() => setIsEditing(false)}
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    );
  }

  return (
    <button
      className={`cursor-pointer hover:ring-2 hover:ring-indigo-500/20 transition-all ${className}`}
      onClick={() => setIsEditing(true)}
    >
      {value}
    </button>
  );
};

export default ComplianceRegister;
