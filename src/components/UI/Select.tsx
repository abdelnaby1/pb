import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { Fragment } from "react/jsx-runtime";
import { bannerTypes } from "../../data";
import { BannerType } from "../../types";

interface IProps {
  selectedId: number;
  setSelectedId: (id: number) => void;
}

const Select = ({ selectedId, setSelectedId }: IProps) => {
  const bannerType = bannerTypes.find(
    (bannerTpe) => bannerTpe.id === selectedId
  );
  const onChangeHandler = (e: BannerType) => {
    const selected = bannerTypes.find((bannerTpe) => bannerTpe.type === e);
    if (selected) {
      setSelectedId(selected?.id);
    }
  };
  return (
    <Listbox value={bannerType?.type} onChange={(e) => onChangeHandler(e)}>
      <Listbox.Label
        as="p"
        className="text-left text-gray-700 mb-[1px] font-medium text-sm"
      >
        Banner Type
      </Listbox.Label>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="flex items-center">
            <span className="ml-3 block truncate">{bannerType?.type}</span>
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-32 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {bannerTypes.map((banner) => (
              <Listbox.Option
                key={banner.id}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                  }`
                }
                value={banner.type}
              >
                {({ selected }) => (
                  <div className="flex items-center ">
                    <span
                      className={`ml-3 block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {banner.type}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default Select;
