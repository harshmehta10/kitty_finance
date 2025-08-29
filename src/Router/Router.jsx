import React, { Suspense } from "react";
import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../Views/Layout/Layout";
import Loader from "../Views/Layout/Loader/Loader";
import Error from "../Views/Layout/Loader/Error";
const Home = lazy(() => import("../Views/Pages/Home/Home"));
const Expense = lazy(() => import("../Views/Pages/Expenses/Expense"));
const CreatedKitty = lazy(() => import("../Components/CreatedKitty"));
const AddExpensesPage = lazy(() =>
  import("../Views/Pages/AddExpenses/AddExpensesPage")
);
const Result = lazy(() => import("../Views/Pages/Resut/Result"));

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
          path: "/addexpense/:eventId",
          element: (
            <Suspense fallback={<Loader />}>
              <AddExpensesPage />
            </Suspense>
          ),
        },
        {
          path: "/events/:eventId/Overview",
          element: (
            <Suspense fallback={<Loader />}>
              <Result />
            </Suspense>
          ),
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
