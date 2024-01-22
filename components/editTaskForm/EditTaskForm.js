import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./EditTaskform.module.css";

const EditTaskForm = ({ task, onClose, onEditTask }) => {
  console.log(task.id);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description,
  });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  console.log(apiUrl);
  useEffect(() => {
    // Actualizar el estado del formulario cuando cambia la tarea
    setEditedTask({
      title: task.title,
      description: task.description,
    });
  }, [task]);

  const handleTitleChange = (e) => {
    setEditedTask({
      ...editedTask,
      title: e.target.value,
    });
  };

  const handleDescriptionChange = (e) => {
    setEditedTask({
      ...editedTask,
      description: e.target.value,
    });
  };

  const handleEditTask = async () => {
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
        // Notificación de error
        toast.error("Hubo un error al editar la tarea", {
          position: "-right",
          autoClose: 3000,
        });
        return;
      }
      // Notificación de éxito
      toast.success("Tarea editada con éxito", {
        position: "top-right",
        autoClose: 3000,
      });
      // Actualizar la tarea en la interfaz y cerrar el formulario de edición
      onEditTask(editedTask);

      onClose();
    } catch (error) {
      console.error("Error al manejar la edición de la tarea:", error);
    }
  };

  return (
    <div className={styles.editFormOverlay}>
      <div className={styles.editFormContent}>
        <h2>Editar Tarea</h2>
        <label>
          Título:
          <input
            type="text"
            value={editedTask.title}
            onChange={handleTitleChange}
            className={styles.inputText}
          />
        </label>
        <label>
          Descripción:
          <textarea
            value={editedTask.description}
            onChange={handleDescriptionChange}
            className={styles.inputText}
          />
        </label>
        <div className={styles.editActionsBtn}>
          <button className={styles.btnSave} onClick={handleEditTask}>
            Guardar Cambios
          </button>
          <button className={styles.btnCancel} onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskForm;
