// components/taskForm/TaskForm.js
import { useState, useEffect } from "react";

import styles from "./TaskForm.module.css";

const TaskForm = ({
  title: initialTitle,
  description: initialDescription,
  onClose,
  onCreateTask,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    // Actualizar el estado del formulario cuando cambia el modo de edición
    setTitle(initialTitle);
    setDescription(initialDescription);
  }, [initialTitle, initialDescription]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleCreateTask = () => {
    // Validar los campos del formulario si es necesario

    // Llamar a la función para crear la tarea
    onCreateTask({ title, description });

    // Limpiar el formulario
    setTitle("");
    setDescription("");

    // Cerrar la ventana modal
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.inputsCreate}>
          <h2>Nueva Tarea</h2>
          <label>
            Título:
            <input className={styles.inputText} type="text" value={title} onChange={handleTitleChange} />
          </label>
          <label>
            Descripción:
            <textarea className={styles.inputText} value={description} onChange={handleDescriptionChange} />
          </label>
        </div>
        <div className={styles.createActionsBtn}>
          <button className={styles.btnCreate} onClick={handleCreateTask}>
            Crear Tarea
          </button>
          <button className={styles.btnCloseForm} onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
