import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  Plus,
  Download,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  AlertCircle,
  ShieldAlert,
  Edit2,
  Trash2,
  Save,
  X,
  Building2,
  Tag,
  User,
  FileText,
  MoreVertical
} from "lucide-react";
import { format, addMonths, differenceInDays } from "date-fns";

const STORAGE_KEY = "compliance_register_data";

const PERIODICITY_OPTIONS = [
  "Monthly",
  "Quarterly",
  "Half-Yearly",
  "Yearly",
  "2-Yearly"
];

const PERIODICITY_MONTHS = {
  Monthly: 1,
  Quarterly: 3,
  "Half-Yearly": 6,
  Yearly: 12,
  "2-Yearly": 24
};

const STATUS_OPTS = ["Pending", "Compliant"];

const ComplianceRegister = () => {
  const [data, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const defaultRow = {
    id: Date.now(),
    origin: "Factories Act, 1948",
    category: "Labour Law",
    traceability: "Section 7A",
    obligations: "Ensure health, safety and welfare of workers",
    provision: "Safety audit and officer appointment",
    applicability: "10+ Workers",
    responsibility: "HR Manager",
    periodicity: "Quarterly",
    priority: "High",
    forms: "Form 21",
    doneDate: format(new Date(), "yyyy-MM-dd"),
    dueDate: "",
    daysLeft: 0,
    status: "Pending",
    autoStatus: "In Progress",
    remarks: "Initial setup",
  };

  const calculateExcelLogic = (row) => {
    if (!row.doneDate || !row.periodicity) return row;

    const done = new Date(row.doneDate);
    const monthsToAdd = PERIODICITY_MONTHS[row.periodicity] || 0;
    const due = addMonths(done, monthsToAdd);
    const dueDateStr = format(due, "yyyy-MM-dd");

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const daysLeft = differenceInDays(due, today);

    let autoStatus = "In Progress";
    if (daysLeft < 0) autoStatus = "Overdue";
    else if (daysLeft === 0) autoStatus = "Due Today";

    return {
      ...row,
      dueDate: dueDateStr,
      daysLeft: daysLeft,
      autoStatus: autoStatus,
    };
  };

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setData(parsed.map(calculateExcelLogic));
    } else {
      setData([calculateExcelLogic(defaultRow)]);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isLoaded]);

  const handleRowUpdate = (id, field, value) => {
    setData(prev => prev.map(row => {
      if (row.id === id) {
        const updated = { ...row, [field]: value };
        return calculateExcelLogic(updated);
      }
      return row;
    }));
  };

  const addNewRow = () => {
    const newRow = { ...defaultRow, id: Date.now() };
    setData([calculateExcelLogic(newRow), ...data]);
  };

  const deleteRow = (id) => {
    if (window.confirm("Are you sure you want to delete this compliance item?")) {
      setData(data.filter(row => row.id !== id));
    }
  };

  const stats = useMemo(() => {
    const total = data.length;
    const overdue = data.filter(d => d.autoStatus === "Overdue" && d.status !== "Compliant").length;
    const compliant = data.filter(d => d.status === "Compliant").length;
    const dueToday = data.filter(d => d.autoStatus === "Due Today" && d.status !== "Compliant").length;

    return { total, overdue, compliant, dueToday };
  }, [data]);

  const filteredData = data.filter(item => {
    const matchesSearch =
      item.provision.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.responsibility.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" || item.autoStatus === filterStatus || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#080808] p-4 md:p-8 space-y-8 animate-in fade-in duration-500">

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
              <CheckCircle size={24} />
            </div>
            Compliance Register
          </h1>
          <p className="text-sm font-medium text-gray-400 mt-1 uppercase tracking-widest">Master Legal Compliance Tracker</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={addNewRow}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            <Plus size={18} /> Add New Entry
          </button>
          <button className="p-2.5 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-400 hover:text-indigo-600 transition-colors shadow-sm">
            <Download size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard label="Total Provisions" value={stats.total} icon={FileText} variant="primary" />
        <StatCard label="Compliant Items" value={stats.compliant} icon={CheckCircle} variant="success" />
        <StatCard label="Overdue / Risk" value={stats.overdue} icon={ShieldAlert} variant="danger" />
        <StatCard label="Due Today" value={stats.dueToday} icon={Clock} variant="warning" />
      </div>

      <div className="bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-gray-800 rounded-[2rem] shadow-sm overflow-hidden flex flex-col">

        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50 dark:bg-gray-900/20">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search provisions, managers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#181818] border border-gray-200 dark:border-gray-800 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            {["All", "Overdue", "Due Today", "In Progress", "Compliant"].map(f => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${filterStatus === f
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "bg-white dark:bg-[#181818] text-gray-400 border border-gray-200 dark:border-gray-800 hover:border-indigo-400"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#121212]">
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-100 dark:border-gray-800">S.No</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-100 dark:border-gray-800">Legal Provision</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-100 dark:border-gray-800">Responsibility</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-100 dark:border-gray-800 text-center">Periodicity</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-100 dark:border-gray-800 text-center">Done Date</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-100 dark:border-gray-800 text-center">Due Date</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-100 dark:border-gray-800 text-center">Risk Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-100 dark:border-gray-800 text-center">Manual Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-100 dark:border-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx) => (
                <tr
                  key={row.id}
                  className={`group transition-colors border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 ${row.status === "Compliant" ? "bg-emerald-50/10" : ""
                    }`}
                >
                  <td className="px-6 py-5 text-sm font-bold text-gray-400">{(idx + 1).toString().padStart(2, '0')}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <EditableText
                        value={row.provision}
                        onSave={(val) => handleRowUpdate(row.id, "provision", val)}
                        className="text-sm font-bold text-gray-900 dark:text-white"
                      />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1 flex items-center gap-2">
                        <Tag size={10} /> {row.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <EditableText
                      value={row.responsibility}
                      onSave={(val) => handleRowUpdate(row.id, "responsibility", val)}
                      className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2"
                      icon={User}
                    />
                  </td>
                  <td className="px-6 py-5 text-center">
                    <EditableSelect
                      value={row.periodicity}
                      options={PERIODICITY_OPTIONS}
                      onChange={(val) => handleRowUpdate(row.id, "periodicity", val)}
                      className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest"
                    />
                  </td>
                  <td className="px-6 py-5 text-center">
                    <input
                      type="date"
                      value={row.doneDate}
                      onChange={(e) => handleRowUpdate(row.id, "doneDate", e.target.value)}
                      className="bg-transparent text-xs font-bold text-gray-500 dark:text-gray-400 outline-none border border-transparent hover:border-indigo-200 dark:hover:border-gray-700 rounded-lg p-1 transition-all"
                    />
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-black text-gray-800 dark:text-gray-200 tabular-nums">{row.dueDate}</span>
                      <span className={`text-[9px] font-black uppercase tracking-tighter ${row.daysLeft < 0 ? "text-rose-500" : "text-emerald-500"
                        }`}>
                        {row.daysLeft < 0 ? `${Math.abs(row.daysLeft)}d overdue` : `${row.daysLeft}d left`}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <StatusBadge status={row.autoStatus} />
                  </td>
                  <td className="px-6 py-5 text-center px-4">
                    <select
                      value={row.status}
                      onChange={(e) => handleRowUpdate(row.id, "status", e.target.value)}
                      className={`text-xs font-bold px-3 py-1 rounded-lg border focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all ${row.status === "Compliant"
                          ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                          : "bg-gray-50 border-gray-200 text-gray-500"
                        }`}
                    >
                      {STATUS_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-5">
                    <button
                      onClick={() => deleteRow(row.id)}
                      className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="p-20 text-center">
              <div className="inline-flex p-5 bg-gray-50 dark:bg-gray-800 rounded-full mb-4">
                <Search size={32} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No results found</h3>
              <p className="text-sm text-gray-400 max-w-xs mx-auto">Try adjusting your filters or search term to find what you're looking for.</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50/50 dark:bg-gray-900/40 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <p className="text-xs font-bold text-gray-400">Totaling {filteredData.length} active provisions</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white dark:bg-[#181818] border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-900 dark:text-white hover:border-indigo-400 transition-all">Previous</button>
            <button className="px-4 py-2 bg-white dark:bg-[#181818] border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-900 dark:text-white hover:border-indigo-400 transition-all">Next</button>
          </div>
        </div>
      </div>
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
