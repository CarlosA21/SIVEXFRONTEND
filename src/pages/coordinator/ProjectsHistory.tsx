import React from "react";

interface Project {
  id: number;
  name: string;
  status: string;
}

const mockProjects: Project[] = [
  { id: 1, name: "Project 1", status: "Approved" },
  { id: 2, name: "Project 2", status: "Rejected" },
  { id: 3, name: "Project 3", status: "Finished" },
];

const ProjectsHistory: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Projects History</h1>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {mockProjects.map((proj) => (
            <tr key={proj.id}>
              <td className="border p-2">{proj.name}</td>
              <td className="border p-2">{proj.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectsHistory;
