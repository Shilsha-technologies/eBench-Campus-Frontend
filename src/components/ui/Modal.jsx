
const Modal = ({ title, children, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
        {children}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#286a94] text-white rounded-md hover:bg-[#3e7ea7]"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
