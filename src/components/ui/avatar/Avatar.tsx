"use client";
import React, { useState } from "react";
import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  fallbackText?: string;
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  size = "md",
  className = "",
  fallbackText,
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
    "2xl": "h-24 w-24 text-xl",
  };

  const getInitials = (text?: string) => {
    if (!text) return "U";
    return text
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Si no hay src, hay error de imagen, o la imagen no se ha cargado aún, mostrar fallback
  const shouldShowFallback = !src || imageError || !imageLoaded;

  return (
    <div
      className={`
        relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white font-semibold
        ${sizeClasses[size]}
        ${onClick ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        ${className}
      `}
      onClick={onClick}
    >
      {!shouldShowFallback && (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover rounded-full"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      )}
      
      {/* Fallback con iniciales */}
      <span className="select-none">
        {getInitials(fallbackText)}
      </span>
    </div>
  );
};

export default Avatar;
