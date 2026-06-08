"use client";

import React from "react";
import { motion } from "framer-motion";
import { InvitacionData } from "@/types";

interface TemplateWrapperProps {
  children: React.ReactNode;
  data: InvitacionData;
}

export function TemplateWrapper({ children, data }: TemplateWrapperProps) {
  const safeData = data || {};
  const primaryColor = safeData.colorPrincipal || "#8B5CF6";
  const secondaryColor = safeData.colorSecundario || "#EC4899";

  const themeStyles = {
    "--primary": primaryColor,
    "--secondary": secondaryColor,
  } as React.CSSProperties;

  return (
    <div 
      style={themeStyles}
      className="min-h-screen w-full bg-[#030712] text-slate-100 flex justify-center selection:bg-[var(--primary)] selection:text-white"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md min-h-screen bg-[#0b0f19] shadow-[0_0_50px_rgba(0,0,0,0.8)] relative flex flex-col overflow-x-hidden border-x border-slate-900"
      >
        {children}
      </motion.div>
    </div>
  );
}
