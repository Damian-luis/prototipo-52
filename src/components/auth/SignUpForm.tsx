"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeft, EyeClose, Eye } from "@/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [form, setForm] = useState({ 
    fname: "", 
    lname: "", 
    email: "", 
    password: "",
    role: "freelancer" // Por defecto freelancer
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!form.fname || !form.lname || !form.email || !form.password) {
      setError("Todos los campos son obligatorios");
      return;
    }
    
    if (!isChecked) {
      setError("Debes aceptar los términos y condiciones");
      return;
    }

    // Guardar datos iniciales en localStorage
    const initialData = {
      firstName: form.fname,
      lastName: form.lname,
      email: form.email,
      password: form.password, // Sin hashear para el prototipo
      role: form.role,
      registrationStep: 'initial',
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('pendingRegistration', JSON.stringify(initialData));
    
    // Redirigir según el rol
    if (form.role === 'freelancer') {
      router.push('/signup/complete-profile');
    } else {
      // Para admin, completar registro directamente
      const adminUser = {
        ...initialData,
        id: Date.now().toString(),
        status: 'active',
        registrationStep: 'completed'
      };
      
      // Guardar en lista de usuarios
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      users.push(adminUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.removeItem('pendingRegistration');
      
      router.push('/signin');
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeft />
          Volver al inicio
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Crear cuenta
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ingresa tus datos para registrarte
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <Label>Tipo de cuenta<span className="text-error-500">*</span></Label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:border-brand-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="freelancer">Freelancer</option>
                  <option value="admin">Empresa/Admin</option>
                </select>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <Label>Nombre<span className="text-error-500">*</span></Label>
                  <Input type="text" id="fname" name="fname" placeholder="Nombre" defaultValue={form.fname} onChange={handleChange} />
                </div>
                <div className="sm:col-span-1">
                  <Label>Apellido<span className="text-error-500">*</span></Label>
                  <Input type="text" id="lname" name="lname" placeholder="Apellido" defaultValue={form.lname} onChange={handleChange} />
                </div>
              </div>
              <div>
                <Label>Email<span className="text-error-500">*</span></Label>
                <Input type="email" id="email" name="email" placeholder="Email" defaultValue={form.email} onChange={handleChange} />
              </div>
              <div>
                <Label>Contraseña<span className="text-error-500">*</span></Label>
                <div className="relative">
                  <Input
                    placeholder="Contraseña"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    defaultValue={form.password}
                    onChange={handleChange}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <Eye className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeClose className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox className="w-5 h-5" checked={isChecked} onChange={setIsChecked} />
                <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                  Al crear una cuenta aceptas los <span className="text-gray-800 dark:text-white/90">Términos y Condiciones</span> y nuestra <span className="text-gray-800 dark:text-white">Política de Privacidad</span>
                </p>
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <div>
                <button 
                  type="submit"
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                >
                  {form.role === 'freelancer' ? 'Continuar con el registro' : 'Registrarse'}
                </button>
              </div>
            </div>
          </form>
          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/signin" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
