// RegisterForm.js
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "./RegisterForm.module.css";

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

    // Validar campos no vacíos
    if (!formData.username || !formData.password) {
      // Notificación de error
      toast.error("Por favor, completa todos los campos", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

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
      toast.success("Registro exitoso", {
        position: "top-right",
        autoClose: 3000,
      });
      // Llevar a la página de inicio después de 2 segundos
      setTimeout(() => {
        onRegister();
        router.push("/");
      }, 2000); // Retardo de 2 segundos (ajusta según tus necesidades)
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
        <div  className={styles.actCont}>
          <button type="submit" className={styles.button}>
            Registrarse
          </button>
          <Link href="/" className={styles.linkHome}>
            Ir a la página de inicio
          </Link>
          <ToastContainer />
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
