import { useState } from "react";
import AddWidget from "../components/AddWidget";
import WidgetsList from "../components/WidgetsList";
import { IWidget } from "../interfaces";

const HomePage = () => {
  const [widgets, setWidgets] = useState<IWidget[]>([]);

  return (
    <>
      <AddWidget setWidgets={setWidgets} widgets={widgets} />
      <section className="w-full">
        <WidgetsList widgets={widgets} setWidgets={setWidgets} />
      </section>
    </>
  );
};

export default HomePage;
