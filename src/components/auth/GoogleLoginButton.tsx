"use client";
import React, { useEffect, useState } from 'react';
import { googleAuthService, GoogleUserData } from '@/services/google-auth.service';
import Button from '@/components/ui/button/Button';

interface GoogleLoginButtonProps {
  onSuccess: (userData: any) => void;
  onError: (error: string) => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleLoginButton({ 
  onSuccess, 
  onError, 
  loading = false, 
  disabled = false,
  className = ""
}: GoogleLoginButtonProps) {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    // Cargar el SDK de Google
    const loadGoogleSDK = () => {
      if (window.google) {
        setIsGoogleLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsGoogleLoaded(true);
      };
      script.onerror = () => {
        onError('Error al cargar el SDK de Google');
      };
      document.head.appendChild(script);
    };

    loadGoogleSDK();
  }, [onError]);

  useEffect(() => {
    if (!isGoogleLoaded) return;

    // Configurar el botón de Google
    window.google?.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    // Renderizar el botón
    window.google?.accounts.id.renderButton(
      document.getElementById('google-login-button'),
      {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: '100%',
      }
    );
  }, [isGoogleLoaded]);

  const handleGoogleResponse = async (response: any) => {
    try {
      setIsAuthenticating(true);
      
      // Decodificar el token JWT de Google
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      const googleUserData: GoogleUserData = {
        email: payload.email,
        fullName: payload.name,
        avatar: payload.picture,
      };

      // Verificar si el usuario existe
      const userExists = await googleAuthService.checkUserExists(googleUserData.email);
      
      if (userExists.exists) {
        // Usuario existe, autenticar directamente
        const authResponse = await googleAuthService.authenticateWithGoogle(googleUserData);
        onSuccess(authResponse);
      } else {
        // Usuario no existe, mostrar formulario de registro o crear automáticamente
        const authResponse = await googleAuthService.authenticateWithGoogle(googleUserData);
        onSuccess(authResponse);
      }
    } catch (error: any) {
      console.error('Error en autenticación con Google:', error);
      onError(error.response?.data?.message || 'Error al autenticar con Google');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleManualGoogleLogin = async () => {
    if (!isGoogleLoaded) {
      onError('SDK de Google no cargado');
      return;
    }

    try {
      setIsAuthenticating(true);
      window.google?.accounts.id.prompt();
    } catch (error: any) {
      console.error('Error al iniciar login de Google:', error);
      onError('Error al iniciar autenticación con Google');
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (!isGoogleLoaded) {
    return (
      <Button
        variant="outline"
        disabled={true}
        className={`w-full ${className}`}
      >
        Cargando Google...
      </Button>
    );
  }

  return (
    <div className="w-full">
      {/* Botón renderizado por Google */}
      <div id="google-login-button" className="w-full"></div>
    </div>
  );
} 