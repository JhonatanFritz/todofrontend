// RegisterForm.js
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import styles from "./RegisterForm.module.css"; // Asegúrate de tener la ruta correcta

const RegisterForm = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Lógica para realizar el registro
    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        console.error("Error al registrar el usuario:", response.statusText);
        // Manejar el error según tus necesidades
        // Notificación de error
        toast.error("No se pudo registrar", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      // Notificación de éxito
      toast.success("Registro exitoso, redirigiendo al Login", {
        position: "top-right",
        autoClose: 3000,
      });
      // Retardar la redirección
      setTimeout(() => {
        onRegister();
        router.push("./login");
      }, 2500); // Retardo de 2 segundos (ajusta según tus necesidades)
    } catch (error) {
      console.error("Error al manejar el registro:", error);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <span>Completa el formulario y empieza a disfrutar</span>
      <form className={styles.registerForm} onSubmit={handleSubmit}>
        <label className={styles.label}>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={styles.input}
          />
        </label>
        <button type="submit" className={styles.button}>
          Registrarse
        </button>
        <ToastContainer />
      </form>
    </div>
  );
};

export default RegisterForm;
