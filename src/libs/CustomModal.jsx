const CustomModal = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  width = "w-96",
}) => {
  if (!isOpen) return null;

  

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className={`bg-white p-6 rounded-lg shadow-lg ${width}`}>
        
        {/* TITLE */}
        {title && (
          <h2 className="text-lg font-semibold text-[#286a94] border-b border-gray-200 pb-2 mb-5">
            {title}
          </h2>
        )}

        {/* BODY */}
        <div className="text-gray-600 mb-5">
          {children}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 cursor-pointer rounded bg-gray-200 text-gray-600"
          >
            {cancelText}
          </button>

          {onConfirm && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 cursor-pointer rounded bg-[#286a94] text-white"
            >
              {loading ? "Processing..." : confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;