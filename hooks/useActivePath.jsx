"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function useActivePath(defaultPath = "/dashboard") {
  const pathname = usePathname();
  const [activePath, setActivePath] = useState(defaultPath);

  useEffect(() => {
    const stored = localStorage.getItem("UrlPath");
    if (stored) {
      setActivePath(stored);
    }
  }, []);

  useEffect(() => {
    if (pathname) {
      setActivePath(pathname);
      localStorage.setItem("UrlPath", pathname);
    }
  }, [pathname]);

  const updatePath = (newPath) => {
    setActivePath(newPath);
    localStorage.setItem("UrlPath", newPath);
  };

  return { activePath, updatePath };
}
