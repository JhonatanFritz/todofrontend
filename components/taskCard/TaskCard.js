// components/taskCard/TaskCard.js
import { useDrag } from "react-dnd";
import styles from "./TaskCard.module.css";
import { useState } from "react";
import TaskDetailsModal from "../taskModal/TaskDetailsModal";

const TaskCard = ({ title, description, status, id, onDelete, onEdit }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id, title, status, description },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [showModal, setShowModal] = useState(false);

  const handleDoubleClick = () => {
    setShowModal(!showModal);
  };
  const handleEdit = () => {
    onEdit(id);
    setShowModal(false);
  };

  const handleDelete = () => {
    // Lógica para eliminar la tarea
    onDelete(id);
    setShowModal(false);
  };
  let cardColor;

  switch (status) {
    case 'todo':
      cardColor = '#5da0f7'; // Color para tareas en estado 'todo'
      break;
    case 'in-progress':
      cardColor = '#089e26'; // Color para tareas en estado 'in-progress'
      break;
    case 'completed':
      cardColor = '#6d21e0'; // Color para tareas en estado 'completed'
      break;
    default:
      cardColor = '#FFFFFF'; // Color predeterminado
  }
  return (
    <div
      ref={drag}
      className={styles.taskcard}
      style={{ backgroundColor: cardColor }}
      onDoubleClick={handleDoubleClick}
    >
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <p className={styles.status}>* Dobli click para más opciones</p>

      {showModal && (
        <TaskDetailsModal
          task={{ id, title, description, status }}
          onClose={() => setShowModal(false)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          
        />
      )}
    </div>
  );
};

export default TaskCard;
