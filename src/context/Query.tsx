"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useContext } from "react";

const queryClient = new QueryClient();

interface QueryProviderContext {
  queryClient: QueryClient;
}
export type { QueryProviderContext };

export const QueryProvider = createContext<QueryProviderContext | undefined>(undefined);

export const QueryClientProviderWrapper = ({ children }: {
  children: React.ReactNode;
}) => {
  return (
    <QueryProvider.Provider value={{ queryClient }}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </QueryProvider.Provider>
  )
}

