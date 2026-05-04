import { Pencil, Trash2 } from "lucide-react";

export default function UserTable({ users, onEdit, onDelete }) {

  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr className="text-left text-gray-600 text-sm ">
            <th className="p-3">First Name</th>
            <th className="p-3">Last Name</th>
            {/* <th className="p-3">Birth Country</th> */}
            <th className="p-3">Nationality</th>
            <th className="p-3">Country Residency</th>
            <th className="p-3">Mobile</th>
            <th className="p-3">Email</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u.id} className="border-t text-sm hover:bg-gray-50">
                <td className="p-3">{u.firstName}</td>
                <td className="p-3">{u.lastName}</td>
                {/* <td className="p-3">{u.birthCountry}</td> */}
                <td className="p-3">{u.nationality}</td>
                <td className="p-3">{u.countryOfResidence}</td>
                <td className="p-3">{u.mobileNumber}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => onEdit(u)}
                    className="text-blue-500 hover:text-blue-700 cursor-pointer"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(u.id)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center p-4 text-gray-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
