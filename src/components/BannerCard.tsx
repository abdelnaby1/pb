import { bannerTypes } from "../data"
import { IFireBaseBanner } from "../interfaces"
import Button from "./UI/Button"
import Image from "./UI/Image"

interface IProps{
  banner: IFireBaseBanner
}

const BannerCard = ({banner}:IProps) => {
  const { url,typeId} = banner

  
  const bannerType  = bannerTypes.find(bannerTpe => bannerTpe.id === typeId)    
  
  return (
    <div className="relative flex flex-col max-w-sm md:max-w-lg mx-auto md:mx-0 border rounded-md p-2 ">
    <span className="absolute m-1 p-1 text-white rounded-lg bg-yellow-700 font-semibold ">{bannerType?.type}</span>
      <Image imageUrl={url}
        alt={"banner"}
        className="rounded-md mb-2 flex-1" 
        />
      <div className="flex items-center justify-between space-x-2">
         <Button variant="danger" fullWidth className="">Remove</Button>
      </div>
    </div>
  )
}

export default BannerCard