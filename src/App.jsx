import "./App.css";
import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { routesConfig } from "./app/config/routesConfig";
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

const router = createBrowserRouter(routesConfig);

function App() {
  return (
    <div>
        <QueryClientProvider client={queryClient}>
          <Toaster position="top-right" reverseOrder={true} />

          <RouterProvider router={router} />
        </QueryClientProvider>
    </div>
  );
}


export default App;
