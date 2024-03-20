import {
  DocumentData,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { firestore } from "../firebase/config";
import { useEffect, useState } from "react";
import WidgetCard from "./WidgetCard";
import BrandsWidgetCard from "./BrandsWidgetCard";
import ProductsWidgetCard from "./ProductsWidgetCard";
import { IBannerWidget, IBrandsWidget, IProductsWidget } from "../interfaces";
import BannerWidgetCard from "./BannerWidgetCard";

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
    // if (widget.data.component_type === "Slider") {
    //   return (
    //     <WidgetCard key={widget.id} widget={widget}>
    //       {widget.data.data[0].name_en}
    //     </WidgetCard>
    //   );
    // }
    if (widget.data.component_type === "Brands") {
      const brandsWidget: IBrandsWidget = {
        component_type: widget.data.component_type,
        name_ar: widget.data.name_ar,
        name_en: widget.data.name_en,
      };
      return <BrandsWidgetCard key={widget.id} widget={brandsWidget} />;
    }
    if (widget.data.component_type.includes("Products")) {
      const productsWidget: IProductsWidget = {
        component_type: widget.data.component_type,
        name_ar: widget.data.name_ar,
        name_en: widget.data.name_en,
        cat_id: widget.data.cat_id,
      };
      return <ProductsWidgetCard key={widget.id} widget={productsWidget} />;
    }
    if (widget.data.component_type.includes("Banner")) {
      const bannerWidget: IBannerWidget = {
        component_type: widget.data.component_type,
        name_ar: widget.data.name_ar,
        name_en: widget.data.name_en,
        url_en: widget.data.url_en,
        url_ar: widget.data.url_ar,
        ref_type: widget.data.ref_type,
      };
      return <BannerWidgetCard key={widget.id} widget={bannerWidget} />;
    }
  });
  console.log(widgets?.length);

  return <div className="w-4/5 mt-14 mx-auto space-y-4">{renderWidgets}</div>;
};

export default WidgetsList;
