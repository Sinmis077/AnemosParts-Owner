import React from "react";
import { Layout } from "@/layouts/Layout";
import { BrandsListPage } from "@/pages/BrandsListPage";
import { CreateBrandPage } from "@/pages/CreateBrandPage";
import { CreateModelPage } from "@/pages/CreateModelPage";
import { CreatePartPage } from "@/pages/CreatePartPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ModelsListPage } from "@/pages/ModelListPage";
import { PartsWarehousePage } from "@/pages/PartsWarehousePage";

export const routesConfig = [
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
      {
        path: "/parts",
        element: <PartsWarehousePage />,
      },
      {
        path: "/parts/add",
        element: <CreatePartPage />,
      },
      {
        path: "/models",
        element: <ModelsListPage />,
      },
      {
        path: "/models/add",
        element: <CreateModelPage />,
      },
      {
        path: "/brands",
        element: <BrandsListPage />,
      },
      {
        path: "/brands/add",
        element: <CreateBrandPage />
      }
    ],
  },
];
