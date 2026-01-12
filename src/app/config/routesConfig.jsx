import React from "react";
import { Layout } from "@/layouts/Layout";
import { BrandsListPage } from "@/pages/BrandsListPage";
import { CreateBrandPage } from "@/pages/CreateBrandPage";
import { CreateModelPage } from "@/pages/CreateModelPage";
import { CreatePartPage } from "@/pages/CreatePartPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ModelsListPage } from "@/pages/ModelListPage";
import { PartsListPage } from "@/pages/PartsListPage.jsx";
import { LoginPage } from '@/pages/LoginPage.jsx';
import { redirect } from 'react-router-dom';
import { api } from '@/app/services/api.js';

export const routesConfig = [
  {
    element: <Layout />,
    loader: loaderHandle,
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
      {
        path: "/parts",
        element: <PartsListPage />,
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
  {
    path: "/login",
    element: <LoginPage />,
  },
];

async function isLoggedIn() {
  try {
    console.log("Challenging user authentication");

    let status = 403;

    await api.options('/parts').then((response) => { status = response.status });

    return status === 200;
  } catch (e) {
    return false;
  }
}

async function loaderHandle() {
  if(await isLoggedIn()) {
    return;
  }

  console.log('Attempting to send user to /login')
  throw redirect("/login");
}