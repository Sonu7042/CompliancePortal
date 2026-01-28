import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const STORAGE_KEY = "compliance_data";

const CompliancePortals = () => {
  // ================= STATES =================
  const [data, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

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
    setIsLoaded(true);
  }, []);

  // ================= SAVE AFTER LOAD =================
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isLoaded]);

  // ================= EXCEL UPLOAD HANDLER =================
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const binaryStr = evt.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Merge with existing data
      setData((prev) => [...prev, ...jsonData]);
    };

    reader.readAsBinaryString(file);
  };

  // ================= FILTER HANDLER =================
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

  // ================= UI =================
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Compliance Register</h1>

        <div className="flex gap-2">
          <label className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer">
            Upload Excel
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleExcelUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              setData([]);
            }}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="font-semibold mb-3">Filters</h3>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 text-sm">
          <input
            name="origin"
            placeholder="Origin"
            value={filters.origin}
            onChange={handleFilterChange}
            className="input"
          />
          <input
            name="category"
            placeholder="Category"
            value={filters.category}
            onChange={handleFilterChange}
            className="input"
          />
          <input
            name="responsibility"
            placeholder="Responsibility"
            value={filters.responsibility}
            onChange={handleFilterChange}
            className="input"
          />
          <select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className="input"
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
            className="input"
          >
            <option value="">Status</option>
            <option>Non-Compliance</option>
            <option>Compliance Initiated</option>
            <option>Complied</option>
          </select>

          <button
            onClick={clearFilters}
            className="bg-gray-600 text-white rounded px-3 py-2"
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
                  <td className="border p-1">{item.provision}</td>
                  <td className="border p-1">{item.applicability}</td>
                  <td className="border p-1">{item.responsibility}</td>
                  <td className="border p-1">{item.periodicity}</td>
                  <td className="border p-1">{item.priority}</td>
                  <td className="border p-1">{item.forms}</td>
                  <td className="border p-1">{item.doneDate}</td>
                  <td className="border p-1">{item.dueDate}</td>
                  <td className="border p-1 text-red-600 font-semibold">
                    {item.status}
                  </td>
                  <td className="border p-1">{item.daysBefore}</td>
                  <td className="border p-1">{item.upcoming}</td>
                  <td className="border p-1">{item.remarks}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompliancePortals;
