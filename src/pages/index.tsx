import { useState } from "react";
import Button from "../components/UI/Button";
import { Modal } from "../components/UI/Modal";
import WidgetsTypes from "../components/WidgetsTypes";
import WidgetForm from "../components/forms/WidgetForm";



const HomePage = () => {
  const [isOpenAddModal,setIsOpenAddModal] =  useState(false)
  const [widgetType,setWidgetType] = useState("");

  const onOpenAddModal = () =>{
    setIsOpenAddModal(true);
  }
  const onCloseAddModal = () => {
    setWidgetType("")
    setIsOpenAddModal(false)    
  }
  console.log(widgetType);
  
  const setWidget = (e: React.MouseEvent<HTMLParagraphElement>) =>{
    const input = e.target as HTMLElement;

    setWidgetType(input.innerText)
  }
  
  return (
    <>
      <section className="max-w-fit mx-auto">
        <div className="flex items-center">
          <h1 className="text-slate-500 w-11/12">Do you want to add new widget? please click on Add Icon</h1>
          <div className="w-4/12">
            <Button variant={"default"} fullWidth className="mx-auto " onClick={onOpenAddModal}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
            </svg>
          </Button>
          </div>
        </div>
        <Modal isOpen={isOpenAddModal} closeModal={onCloseAddModal} title="Add Widget">
          <WidgetsTypes setWidgetType={setWidget} />
          <WidgetForm onCloseModal={onCloseAddModal} type={widgetType}/>
        </Modal>
      </section>
      <div>Widgets</div>
    </>
  );
};

export default HomePage;
