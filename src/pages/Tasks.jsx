import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


const STORAGE_KEY = "compliance_data";

const CompliancePortals = () => {
  // ================= STATES =================
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  // ===== INLINE EDIT STATE =====
  const [editingCell, setEditingCell] = useState({
    rowIndex: null,
    field: null,
  });

  // Editable columns
  const editableFields = [
    "provision",
    "applicability",
    "responsibility",
    "periodicity",
    "priority",
    "forms",
    "doneDate",
  ];

  // Periodicity dropdown options
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


  const initialState = {
    origin: "",
    category: "",
    traceability: "",
    obligations: "",
    provision: "",
    applicability: "",
    responsibility: "",
    periodicity: "",
    priority: "",
    forms: "",
    doneDate: "",
    dueDate: "",
    status: "Non-Compliance",
    daysBefore: "",
    upcoming: "",
    remarks: "",
  };


  const temp = {
    origin: "Factories Act, 1948",
    category: "Labour Law",
    traceability: "Section 7A",
    obligations: "Ensure health, safety and welfare of workers",
    provision: "Safety audit and appointment of safety officer",
    applicability: "Manufacturing units with 10+ workers",
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

  // ===== INLINE EDIT FUNCTIONS =====
  const handleDoubleClick = (rowIndex, field) => {
    if (!editableFields.includes(field)) return;
    setEditingCell({ rowIndex, field });
  };


  const handleCellChange = (e, rowIndex, field) => {
    const updated = [...data];
    updated[rowIndex][field] = e.target.value;

    // 🔥 Auto calculate when Periodicity or Done Date changes
    if (field === "periodicity" || field === "doneDate") {
      const startDate = updated[rowIndex].doneDate;
      const period = updated[rowIndex].periodicity;

      const dueDate = getDueDateByPeriodicity(startDate, period);
      updated[rowIndex].dueDate = dueDate;

      const { status, daysBefore, upcoming } = calculateStatusAndDays(dueDate);

      updated[rowIndex].status = status;
      updated[rowIndex].daysBefore = daysBefore;
      updated[rowIndex].upcoming = upcoming;
    }

    setData(updated);
  };

  const stopEditing = () => {
    setEditingCell({ rowIndex: null, field: null });
  };

  const [form, setForm] = useState(temp);

  const [filters, setFilters] = useState({
    origin: "",
    category: "",
    responsibility: "",
    priority: "",
    status: "",
  });

  // ================= LOAD FIRST =================
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setData(JSON.parse(stored));
    }
    setIsLoaded(true); // 🔑 mark load complete
  }, []);

  // ================= SAVE ONLY AFTER LOAD =================
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isLoaded]);
  // ================= HANDLERS =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedData = [...data, form];
    setData(updatedData);

    setForm(initialState);
    setShowForm(false);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({
      origin: "",
      category: "",
      responsibility: "",
      priority: "",
      status: "",
    });
  };

  // ================= FILTER LOGIC =================
  const filteredData = data.filter((item) => {
    return (
      (!filters.origin || item.origin === filters.origin) &&
      (!filters.category || item.category === filters.category) &&
      (!filters.responsibility ||
        item.responsibility === filters.responsibility) &&
      (!filters.priority || item.priority === filters.priority) &&
      (!filters.status || item.status === filters.status)
    );
  });

  // ===== DATE & STATUS CALCULATION LOGIC =====
  const getDueDateByPeriodicity = (startDate, periodicity) => {
    if (!startDate || !periodicity) return "";

    const date = new Date(startDate);

    const map = {
      Monthly: 1,
      Quarterly: 3,
      "Half-Yearly": 6,
      Yearly: 12,
      "2-Yearly": 24,
      "3-Yearly": 36,
      "4-Yearly": 48,
      "5-Yearly": 60,
    };

    date.setMonth(date.getMonth() + (map[periodicity] || 0));
    return date.toISOString().split("T")[0];
  };

  const calculateStatusAndDays = (dueDate) => {
    if (!dueDate)
      return {
        status: "Non-Compliance",
        daysBefore: "",
        upcoming: "",
      };

    const today = new Date();
    const due = new Date(dueDate);

    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    // ❌ Expired
    if (diffDays < 0) {
      return {
        status: "Non-Compliance",
        daysBefore: diffDays,
        upcoming: "Expired",
      };
    }

    // ✅ Due today
    if (diffDays === 0) {
      return {
        status: "Complied",
        daysBefore: 0,
        upcoming: "Due Today",
      };
    }

    // ⚠️ Action required soon (within 30 days)
    if (diffDays <= 30) {
      return {
        status: "Compliance Initiated",
        daysBefore: diffDays,
        upcoming: "Initiate Compliance",
      };
    }

    // 😌 Safe zone
    return {
      status: "Compliance Initiated",
      daysBefore: diffDays,
      upcoming: "No Worry",
    };
  };


  const handleExcelUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (evt) => {
    const excelData = new Uint8Array(evt.target.result);
    const workbook = XLSX.read(excelData, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const json = XLSX.utils.sheet_to_json(worksheet, {
      defval: "",
    });

    // ✅ MAP + AUTO CALCULATION
    const mapped = json.map((row) => {
      const periodicity = row["Periodicity"] || "Quarterly";
      const doneDate = row["Done Date"] || "";

      // 🔥 AUTO DUE DATE
      const dueDate = getDueDateByPeriodicity(doneDate, periodicity);

      // 🔥 AUTO STATUS / DAYS / UPCOMING
      const { status, daysBefore, upcoming } =
        calculateStatusAndDays(dueDate);

      return {
        origin: row["Origin"] || "",
        category: row["Category"] || "",
        traceability: row["Traceability"] || "",
        obligations: row["Obligations"] || "",
        provision: row["Provision"] || "",
        applicability: row["Applicability"] || "",
        responsibility: row["Responsibility"] || "",
        periodicity,
        priority: row["Priority"] || "",
        forms: row["Forms"] || "",
        doneDate,
        dueDate,
        status,
        daysBefore,
        upcoming,
        remarks: row["Remarks"] || "",
      };
    });

    setData(mapped); // ✅ table + localStorage auto update
  };

  reader.readAsArrayBuffer(file);
};



const downloadExcel = () => {
  if (!data.length) return;

  const exportData = data.map((row) => ({
    Origin: row.origin,
    Category: row.category,
    Traceability: row.traceability,
    Obligations: row.obligations,
    Provision: row.provision,
    Applicability: row.applicability,
    Responsibility: row.responsibility,
    Periodicity: row.periodicity,
    Priority: row.priority,
    Forms: row.forms,
    "Done Date": row.doneDate,
    "Due Date": row.dueDate,
    Status: row.status,
    "Days Before": row.daysBefore,
    Upcoming: row.upcoming,
    Remarks: row.remarks,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Compliance");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, "Compliance_Register.xlsx");
};


  // ================= UI =================
  return (
    <div className="h-full">
      {/* Header */}
     <div className="flex justify-between items-center mb-4">
     <h1 className="text-2xl font-bold">Compliance Register</h1>

  <div className="flex gap-2 items-center">
    {/* Upload Excel */}
    <label className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer">
      Upload Excel
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleExcelUpload}
        className="hidden"
      />
    </label>

    {/* Download Excel */}
    <button
      onClick={downloadExcel}
      className="bg-purple-600 text-white px-4 py-2 rounded"
    >
      Download Excel
    </button>

    {/* Add Compliance */}
    <button
      onClick={() => setShowForm(true)}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      + Add Compliance
    </button>

    {/* Clear All */}
    {/* <button
      onClick={() => {
        localStorage.removeItem(STORAGE_KEY);
        setData([]);
      }}
      className="bg-red-600 text-white px-4 py-2 rounded"
    >
      Clear All
    </button> */}
  </div>
</div>


      {/* Filters */}
      <div className="bg-white p-4 rounded-[20px] shadow mb-4">
        <h3 className="font-semibold mb-3">Filters</h3>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 text-sm">
          <input
            name="origin"
            placeholder="Origin"
            value={filters.origin}
            onChange={handleFilterChange}
            className="input rounded-[10px]"
          />
          <input
            name="category"
            placeholder="Category"
            value={filters.category}
            onChange={handleFilterChange}
            className="input rounded-[10px]"
          />
          <input
            name="responsibility"
            placeholder="Responsibility"
            value={filters.responsibility}
            onChange={handleFilterChange}
            className="input rounded-[10px]"
          />
          <select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className="input rounded-[10px]"
          >
            <option value="">Priority</option>
            <option>Very High</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="input rounded-[10px]"
          >
            <option value="">Status</option>
            <option>Non-Compliance</option>
            <option>Compliance Initiated</option>
            <option>Complied</option>
          </select>
          <button
            onClick={clearFilters}
            className="bg-gray-600 text-white  px-3 py-2 rounded-lg"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Table */}
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
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="17" className="p-4 text-gray-500">
                  No Compliance Found
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
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
                      onDoubleClick={() => handleDoubleClick(index, field)}
                    >
                      {editingCell.rowIndex === index &&
                      editingCell.field === field ? (
                        field === "periodicity" ? (
                          // 🔽 Periodicity Dropdown
                          <select
                            autoFocus
                            value={item[field]}
                            onChange={(e) => handleCellChange(e, index, field)}
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
                          // ✏️ Normal Input
                          <input
                            autoFocus
                            type={field.includes("Date") ? "date" : "text"}
                            value={item[field]}
                            onChange={(e) => handleCellChange(e, index, field)}
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
                  <td
                    className={`border p-1 font-semibold ${
                      item.status === "Non-Compliance"
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {item.status}
                  </td>
                  <td className="border p-1">{item.daysBefore}</td>
                  <td
                    className={`border p-1 font-semibold ${
                      item.upcoming === "Expired"
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {item.upcoming}
                  </td>

                  <td className="border p-1">{item.remarks}</td>
                </tr>
              ))
            )}
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

export default CompliancePortals;