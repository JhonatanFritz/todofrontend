import { useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import Link from "next/link";
import styles from "./Login.module.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const handleLogin = async () => {
    try {
      // Validar campos no vacíos
      if (!username || !password) {
        // Notificación de error
        toast.error("Por favor, completa todos los campos", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const response = await fetch(`https://backendtask-5822.onrender.com/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);

        toast.success("Inicio de sesión exitoso", {
          position: "top-right",
          autoClose: 3000,
        });

        setTimeout(() => {
          router.push("/dashboard/");
        }, 2500);
      } else {
        toast.error("Hubo un error al iniciar sesión", {
          position: "top-right",
          autoClose: 3000,
        });

        console.error("Error al iniciar sesión:", response.statusText);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <div className={styles.lcontainer}>
      <div className={styles.loginContainer}>
        <div className={styles.loginImgContainer}>
          <Image
            src="/sinbg.png"
            alt="Descripción de la imagen"
            width={400}
            height={400}
          />
        </div>
        <div className={styles.loginFormContainerA}>
          <div className={styles.formTitle}>
            <span>Bienvenido de nuevo</span>
          </div>
          <div className={styles.loginFormContainerB}>
            <span>Ingresa a tu cuenta</span>
            <input
              type="text"
              placeholder="Nombre de usuario"
              onChange={(e) => setUsername(e.target.value)}
              className={styles.inputText}
            />
            <input
              type="password"
              placeholder="Contraseña"
              onChange={(e) => setPassword(e.target.value)}
              className={styles.inputText}
            />
            <button onClick={handleLogin} className={styles.btn}>
              Iniciar sesión
            </button>
            <Link href="/" className={styles.linkHomes}>
              👈 Inicio
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
