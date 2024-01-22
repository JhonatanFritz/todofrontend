import Link from "next/link";
import Image from "next/image";
import styles from "./WelcomPage.module.css";

export default function WelcomePage() {
  return (
    <>
      <div className={styles.welcomeContainer}>
        <div className={styles.leftSide}>
          <h1 className={styles.mainTitle}>
            Bienvenido a <span className={styles.mainSpan}>ToDo</span> App
          </h1>
          <p className={styles.shortMessage}>Comienza tu experiencia:</p>
          <Link href="/auth/login" className={styles.btn}>
            Iniciar Sesión
          </Link>
          {"ó"}
          <Link href="/auth/register" className={styles.btn}>
             Registrarse
          </Link>
          <p className={styles.myName}>Desarrollado por Jhonatan Fritz MC</p>
        </div>
        <div className={styles.rightSide}>
          <div>
            <Image
              src="/todoIMg.png" // Ruta de la imagen en la carpeta "public"
              alt="Descripción de la imagen"
              width={600} // Ancho deseado de la imagen
              height={400} // Altura deseada de la imagen
            />
          </div>
        </div>
      </div>
    </>
  );
}
