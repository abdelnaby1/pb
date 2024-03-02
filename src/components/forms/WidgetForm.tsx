import BannerForm from './Banner'
import SliderForm from './Slider'
import BrandsForm from './Brands'
import HoriznotalProductsForm from './HoriznotalProducts'
import VerticalProductsForm from './VerticalProducts'
interface IProps{
    type: string
    onCloseModal: () => void
}
interface Types{
  [Banner: string]: JSX.Element,
  Slider: JSX.Element,
  Brands: JSX.Element,
  ["Horiznotal Products"]: JSX.Element,
  ["Vertical Products"]: JSX.Element,

}

const WidgetForm = ({type,onCloseModal}: IProps) => {
  const widgetTypeForm: Types = {
  Banner: <BannerForm onClose={onCloseModal}/>,
  Slider: <SliderForm />,
  Brands: <BrandsForm />,
  ["Horiznotal Products"]: <HoriznotalProductsForm />,
  ["Vertical Products"]: <VerticalProductsForm />,

}
  return (
    <div>{widgetTypeForm[type]}</div>
  )
}

export default WidgetForm