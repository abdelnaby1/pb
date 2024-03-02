import React from 'react'
interface IProps{
   setWidgetType: (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => void 
}

const WidgetsTypes = ({setWidgetType}:IProps) => {
  return (
    <div className='flex items-center justify-center space-x-2'>
        <p className='bg-slate-400 rounded-md p-1 cursor-pointer' onClick={setWidgetType}>Banner</p>
        <p className='bg-slate-400 rounded-md p-1 cursor-pointer' onClick={setWidgetType}>Slider</p>
        <p className='bg-slate-400 rounded-md p-1 cursor-pointer' onClick={setWidgetType}>Brands</p>
        <p className='bg-slate-400 rounded-md p-1 cursor-pointer' onClick={setWidgetType}>Horiznotal Products</p>
        <p className='bg-slate-400 rounded-md p-1 cursor-pointer' onClick={setWidgetType}>Vertical Products</p>

    </div>
  )
}

export default WidgetsTypes