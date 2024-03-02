import React from 'react'
import BannerForm from './Banner'
import SliderForm from './Slider'
import BrandsForm from './Brands'
import HoriznotalProductsForm from './HoriznotalProducts'
import VerticalProductsForm from './VerticalProducts'
interface IProps{
    type: string
}
interface Types{
  [Banner: string]: JSX.Element,
  Slider: JSX.Element,
  Brands: JSX.Element,
  ["Horiznotal Products"]: JSX.Element,
  ["Vertical Products"]: JSX.Element,

}
const widgetTypeForm: Types = {
  Banner: <BannerForm />,
  Slider: <SliderForm />,
  Brands: <BrandsForm />,
  ["Horiznotal Products"]: <HoriznotalProductsForm />,
  ["Vertical Products"]: <VerticalProductsForm />,

}
const WidgetForm = ({type}: IProps) => {
  return (
    <div>{widgetTypeForm[type]}</div>
  )
}

export default WidgetForm