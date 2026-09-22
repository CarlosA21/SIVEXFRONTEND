import React from "react";

interface Request {
  id: number;
  name: string;
  type: string;
  date: string;
  period: string;
  modality: string;
  facilitator: string;
}

const mockRequests: Request[] = [
  { id: 1, name: "Activity 1", type: "Extension", date: "2025-09-14", period: "2025-2", modality: "In-person", facilitator: "Juan Pérez" },
  { id: 2, name: "Project 2", type: "Volunteering", date: "2025-09-20", period: "2025-2", modality: "Online", facilitator: "María López" },
];

const ProjectRequestsManagement: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Project Requests Management</h1>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Period</th>
            <th className="border p-2">Modality</th>
            <th className="border p-2">Facilitator</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockRequests.map((req) => (
            <tr key={req.id}>
              <td className="border p-2">{req.name}</td>
              <td className="border p-2">{req.type}</td>
              <td className="border p-2">{req.date}</td>
              <td className="border p-2">{req.period}</td>
              <td className="border p-2">{req.modality}</td>
              <td className="border p-2">{req.facilitator}</td>
              <td className="border p-2 flex gap-2">
                <button className="bg-green-500 text-white px-2 py-1 rounded">Approve</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectRequestsManagement;
