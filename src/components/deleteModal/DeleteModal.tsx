interface DeleteModalProps {
  setConfirmDeleteId: React.Dispatch<React.SetStateAction<string | null>>;
  handleDelete: (id: string) => void;
  confirmDeleteId: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  setConfirmDeleteId,
  handleDelete,
  confirmDeleteId,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
        <p className="text-sm mb-6">
          Are you sure you want to delete this order?
        </p>
        <div className="flex justify-end gap-4">
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            onClick={() => setConfirmDeleteId(null)}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => handleDelete(confirmDeleteId)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
