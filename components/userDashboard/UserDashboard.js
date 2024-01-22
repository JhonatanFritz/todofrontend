import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import { useDrop } from "react-dnd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TaskCard from "../taskCard/TaskCard";
import TaskForm from "../taskFrom/TaskForm";
import EditTaskForm from "../editTaskForm/EditTaskForm";
import TaskDetailsModal from "../taskModal/TaskDetailsModal";
import styles from "./UserDashboard.module.css";
const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = jwt.decode(token);

        if (!decodedToken) {
          console.error("Error al decodificar el token");
          return;
        }

        setUser({ username: decodedToken.username });

        const tasksResponse = await fetch(`${apiUrl}/tasks/all`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!tasksResponse.ok) {
          console.error(
            "Error al obtener tareas del usuario:",
            tasksResponse.statusText
          );
          return;
        }

        const tasksData = await tasksResponse.json();
        setTasks(tasksData.tasks);
      } catch (error) {
        console.error("Error al obtener detalles del usuario:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      router.push("../auth/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleDrop = async (item, newStatus) => {
    try {
      if (!item.id) {
        console.error(
          "Error: El objeto de la tarea no tiene un ID (id) definido."
        );
        return;
      }

      const updatedTask = { ...item, status: newStatus };
      const token = localStorage.getItem("token");

      const response = await fetch(`${apiUrl}/tasks/update/${item.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        console.error("Error al actualizar la tarea:", response.statusText);
        return;
      }

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === item.id ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error(
        "Error al manejar la operación de arrastrar y soltar:",
        error
      );
    }
  };

  const [, dropTodo] = useDrop({
    accept: "TASK",
    drop: (item) => {
      const itemWithId = { ...item, id: item.id };
      handleDrop(itemWithId, "todo");
    },
  });

  const [, dropInProgress] = useDrop({
    accept: "TASK",
    drop: (item) => handleDrop(item, "in-progress"),
  });

  const [, dropCompleted] = useDrop({
    accept: "TASK",
    drop: (item) => handleDrop(item, "completed"),
  });

  const openCreateTaskModal = () => {
    setIsModalOpen(true);
  };

  const closeCreateTaskModal = () => {
    setIsModalOpen(false);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Actualizar el estado o realizar cualquier otra lógica según tus necesidades
    // En este ejemplo, se actualiza el estado de un formulario
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleCreateTask = async ({ title, description }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${apiUrl}/tasks/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          status: "todo",
        }),
      });

      if (!response.ok) {
        console.error("Error al crear la tarea:", response.statusText);
        // Notificación de error
        toast.error("Hubo un error al crear la tarea", {
          position: "-right",
          autoClose: 3000,
        });
        return;
      }

      const updatedTasksResponse = await fetch(`${apiUrl}/tasks/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!updatedTasksResponse.ok) {
        console.error(
          "Error al obtener tareas actualizadas:",
          updatedTasksResponse.statusText
        );
        return;
      }

      const updatedTasksData = await updatedTasksResponse.json();
      setTasks(updatedTasksData.tasks);
      // Notificación de éxito
      toast.success("Tarea creada con éxito", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al manejar la creación de la tarea:", error);
    }
  };
  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/tasks/delete/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Error al eliminar la tarea:", response.statusText);
        // Notificación de error
        toast.error("Hubo un error al eliminar la tarea", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      // Notificación de éxito
      toast.success("Tarea eliminada con éxito", {
        position: "top-right",
        autoClose: 3000,
      });
      // Actualizar las tareas en el estado local si la eliminación en el backend fue exitosa
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error al manejar la eliminación de la tarea:", error);
    }
  };

  const updateTaskInState = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      )
    );
  };

  const openEditTaskModal = (task) => {
    setSelectedTask(task);
    setEditModalOpen(true);
  };

  const closeEditTaskModal = () => {
    setSelectedTask(null);
    setEditModalOpen(false);
  };
  return (
    <div>
      {user ? (
        <div className={styles.dadhbaordContainer}>
          <div className={styles.userDataContainer}>
            <div>
              <p className={styles.userWelcome}>Bienvenido</p>
              <span className={styles.userName}>{user.username}</span>
            </div>
            <div className={styles.actionBTN}>
              <button onClick={openCreateTaskModal}>Crear Tarea</button>
              <button onClick={() => console.log("Ir a ajustes")}>
                Ajustes
              </button>
              <button className={styles.actionOff} onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </div>
          </div>

          <div className={styles.taskDataContainer}>
            <h2>Tus Tareas:</h2>
            <div className={styles.taskContainer}>
              <div ref={dropTodo} className={styles.taskStatus}>
                <h3>Pendientes</h3>
                {tasks
                  .filter((task) => task.status === "todo")
                  .map((task) => (
                    <TaskCard
                      key={task._id}
                      id={task._id}
                      title={task.title}
                      description={task.description}
                      status={task.status}
                      onDelete={handleDeleteTask}
                    />
                  ))}
              </div>
              <div ref={dropInProgress} className={styles.taskStatus}>
                <h3>En curso</h3>
                {tasks
                  .filter((task) => task.status === "in-progress")
                  .map((task) => (
                    <TaskCard
                      key={task._id}
                      id={task._id}
                      title={task.title}
                      description={task.description}
                      status={task.status}
                      onDelete={handleDeleteTask}
                    />
                  ))}
              </div>
              <div ref={dropCompleted} className={styles.taskStatus}>
                <h3>Completado</h3>
                {tasks
                  .filter((task) => task.status === "completed")
                  .map((task) => (
                    <TaskCard
                      key={task._id}
                      id={task._id}
                      title={task.title}
                      description={task.description}
                      status={task.status}
                      onDelete={handleDeleteTask}
                    />
                  ))}
              </div>
            </div>
            {isModalOpen && (
              <TaskForm
                onCreateTask={handleCreateTask}
                onInputChange={handleInputChange}
                onClose={closeCreateTaskModal}
              />
            )}
          </div>

          <ToastContainer />
        </div>
      ) : (
        <p>Debes iniciar sesión</p>
      )}
    </div>
  );
};

export default UserDashboard;
