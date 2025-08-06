// /context/LanguageContext.tsx
"use client";
import { createContext, useContext } from "react";

export const LanguageContext = createContext<string>("fr");

export const useLanguage = () => useContext(LanguageContext);
