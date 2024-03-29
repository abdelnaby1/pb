import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import PageNotFound from "../pages/PageNotFound";
import RootLayout from "../pages/Layout";
import ErrorHandler from "../components/errors/ErrorHandler";
import HomePage from "../pages";
import LoginPage from "../pages/Login";
import ProfilePage from "../pages/Profile";

const storageKey =  "loggedInUser";
const userDataString = localStorage.getItem(storageKey);
const userData = userDataString ? JSON.parse(userDataString): null;



const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Root Layout */}
      <Route path="/" element={<RootLayout />} errorElement={<ErrorHandler />}>
        <Route
          index
          element={
            <ProtectedRoute isAllowed={userData?.token} redirectPath="/login" data={userData}>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute isAllowed={userData?.token} redirectPath="/prfoile" data={userData}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="login"
          element={
            <ProtectedRoute isAllowed={!userData?.token} redirectPath="/" data={userData}>
              <LoginPage />
            </ProtectedRoute>
          }
        />
       
      </Route>

      {/* Page Not Found */}
      <Route path="*" element={<PageNotFound />} />
    </>
  )
);

export default router;
