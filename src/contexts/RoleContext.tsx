import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserRole } from "@/types";

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentOfficeId: string; // for staff view
}

const RoleContext = createContext<RoleContextType>({
  role: "admin",
  setRole: () => {},
  currentOfficeId: "off-1",
});

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("admin");

  return (
    <RoleContext.Provider value={{ role, setRole, currentOfficeId: "off-1" }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
