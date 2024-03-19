import {
  DocumentData,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { firestore } from "../firebase/config";
import { useEffect, useState } from "react";

const WidgetsList = () => {
  const [widgets, setWidgets] = useState<{ id: string; data: DocumentData }[]>(
    []
  );
  const getWidgets = async () => {
    try {
      const widgetsRef = collection(firestore, "widgets");
      const querySnapshot = await getDocs(
        query(widgetsRef, orderBy("timestampe"))
      );

      const arr: { id: string; data: DocumentData }[] = [];
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        const widget = {
          id: doc.id,
          data: doc.data(),
        };
        arr.push(widget);
      });
      setWidgets(arr);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getWidgets();
  }, []);

  const renderWidgets = widgets.map((widget) => {
    if (widget.data.component_type === "Slider") {
      return <div key={widget.id}>{widget.data.data[0].name_en}</div>;
    }
    return <div key={widget.id}>{widget.data.name_en}</div>;
  });
  console.log(widgets?.length);

  return <div>{renderWidgets}</div>;
};

export default WidgetsList;
