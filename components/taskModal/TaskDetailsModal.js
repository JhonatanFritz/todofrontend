// components/taskDetailsAndForm/TaskDetailsAndForm.js
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./TaskDetailsModal.module.css";
import EditTaskForm from "../editTaskForm/EditTaskForm"; // Asegúrate de tener la ruta correcta

const TaskDetailsModal = ({ task, onClose, onEdit, onDelete }) => {
  const [showDetails, setShowDetails] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
  });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    try {
      // Realizar solicitud al backend para actualizar la tarea
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/tasks/update/${task.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedTask),
      });

      if (!response.ok) {
        console.error("Error al actualizar la tarea:", response.statusText);
        // Manejar el error como sea necesario
        return;
      }

      // Actualizar la tarea en la interfaz y volver al modo de detalles
      onEdit(task.id);

      setEditMode(false);
    } catch (error) {
      console.error("Error al manejar la edición de la tarea:", error);
    }
  };

  const handleDeleteClick = () => {
    onDelete(task.id);
    onClose();
  };

  const handleInputChange = (e) => {
    setEditedTask({
      ...editedTask,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {editMode ? (
          <EditTaskForm
            task={editedTask}
            onClose={() => setEditMode(false)}
            onEditTask={() => {
              window.location.reload();
            }} // Ajusta según sea necesario
            onInputChange={handleInputChange}
          />
        ) : (
          <>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <div className={styles.btnActions}>
              <button className={styles.btnEdit} onClick={handleEditClick}>
                Editar
              </button>
              <button className={styles.btnDelete} onClick={handleDeleteClick}>
                Eliminar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskDetailsModal;
