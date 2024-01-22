import React from "react";
import RegisterForm from '@/components/registerForm/RegisterForm'; // Asegúrate de tener la ruta correcta

const RegisterPage = () => {
  const handleRegister = () => {
    // Lógica a realizar después del registro exitoso, por ejemplo, redireccionar al usuario
    // a la página de inicio de sesión.
  };

  return (
    <div>
      <RegisterForm onRegister={handleRegister} />
    </div>
  );
};

export default RegisterPage;
