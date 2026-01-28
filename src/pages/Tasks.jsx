import { useState } from "react";

const ComplianceTasks = () => {
  const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState([]);

  const [formData, setFormData] = useState({
    origin: "",
    category: "",
    obligation: "",
    applicability: "",
    responsibility: "",
    priority: "",
    dueDate: "",
    status: "Non-Compliance",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTasks([...tasks, formData]);
    setFormData({
      origin: "",
      category: "",
      obligation: "",
      applicability: "",
      responsibility: "",
      priority: "",
      dueDate: "",
      status: "Non-Compliance",
    });
    setShowForm(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Compliance Tasks</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Task
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">S.No</th>
              <th className="border p-2">Origin</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Obligation</th>
              <th className="border p-2">Applicability</th>
              <th className="border p-2">Responsibility</th>
              <th className="border p-2">Priority</th>
              <th className="border p-2">Due Date</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center p-4 text-gray-500">
                  No Tasks Added
                </td>
              </tr>
            ) : (
              tasks.map((task, index) => (
                <tr key={index} className="text-center">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{task.origin}</td>
                  <td className="border p-2">{task.category}</td>
                  <td className="border p-2">{task.obligation}</td>
                  <td className="border p-2">{task.applicability}</td>
                  <td className="border p-2">{task.responsibility}</td>
                  <td className="border p-2">{task.priority}</td>
                  <td className="border p-2">{task.dueDate}</td>
                  <td className="border p-2 text-red-600 font-semibold">
                    {task.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white w-full max-w-xl p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Add Compliance Task</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="origin"
                placeholder="Origin of Compliance"
                className="input"
                onChange={handleChange}
                required
              />
              <input
                name="category"
                placeholder="Compliance Category"
                className="input"
                onChange={handleChange}
                required
              />
              <input
                name="obligation"
                placeholder="Obligation"
                className="input"
                onChange={handleChange}
                required
              />
              <input
                name="applicability"
                placeholder="Applicability"
                className="input"
                onChange={handleChange}
              />
              <input
                name="responsibility"
                placeholder="Responsibility"
                className="input"
                onChange={handleChange}
              />
              <select
                name="priority"
                className="input"
                onChange={handleChange}
              >
                <option value="">Select Priority</option>
                <option>Very High</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <input
                type="date"
                name="dueDate"
                className="input"
                onChange={handleChange}
                required
              />

              <div className="flex justify-end gap-3 pt-4">
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
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceTasks;
