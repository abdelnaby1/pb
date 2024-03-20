import { Toaster } from "react-hot-toast";
import "./App.css";

import router from "./router";
import { RouterProvider } from "react-router-dom";
import { register } from "swiper/element";

function App() {
  register();
  return (
    <main className="">
      <RouterProvider router={router} />
      <Toaster />
    </main>
  );
}

export default App;
