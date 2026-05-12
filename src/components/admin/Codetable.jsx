
const CodeTable = ({ codes, handleCopy }) => {
  if (codes.length === 0)
    return (
      <div className="text-gray-500 text-center mt-10 text-sm md:text-base">
        No generated codes yet. Click “Generate Code” to create one.
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow rounded-lg text-sm md:text-base">
        <thead>
          <tr className="bg-[#286a94] text-white text-left">
            <th className="py-3 px-4">Vendor Name</th>
            <th className="py-3 px-4">Generated Code</th>
            <th className="py-3 px-4">Uses</th>
            <th className="py-3 px-4">Subscription</th>
          </tr>
        </thead>
        <tbody>
          {codes.map((item, index) => (
            <tr key={index} className="border-b hover:bg-gray-50 transition">
              <td className="py-3 px-4">{item.vendor}</td>
              <td className="py-3 px-4 font-mono text-[#286a94] flex items-center gap-2">
                <span className="truncate">{item.code}</span>
                <button
                  onClick={() => handleCopy(item.code)}
                  className="bg-[#286a94] text-white px-2 py-1 rounded hover:bg-[#1f5777] transition text-xs"
                >
                  Copy
                </button>
              </td>
              <td className="py-3 px-4">{item.uses}</td>
              <td className="py-3 px-4">{item.subscription}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CodeTable;
