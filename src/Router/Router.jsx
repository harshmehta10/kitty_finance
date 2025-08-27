import React, { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../Views/Layout/Layout";
import Loader from "../Views/Layout/Loader/Loader";
import Error from "../Views/Layout/Loader/Error";
import Home from "../Views/Pages/Home/Home";
import Expense from "../Views/Pages/Expenses/Expense";
import CreatedKitty from "../Components/CreatedKitty";
import AddExpensesPage from "../Views/Pages/AddExpenses/AddExpensesPage";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <Error />,
      children: [
        {
          path: "/",
          element: (
            <Suspense fallback={<Loader />}>
              <Home />
            </Suspense>
          ),
        },
        {
          path: "/expenses",
          element: (
            <Suspense fallback={<Loader />}>
              <Expense />
            </Suspense>
          ),
        },
        {
          path: "/created-kitty/:kittyId",
          element: (
            <Suspense fallback={<Loader />}>
              <CreatedKitty />
            </Suspense>
          ),
        },
        {
          path: "/add-expense/:eventId",
          element: (
            <Suspense fallback={<Loader />}>
              <AddExpensesPage />
            </Suspense>
          ),
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
