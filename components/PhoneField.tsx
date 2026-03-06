"use client";

import { PhoneFieldProps } from "@/types";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function PhoneField({ value, onChange }: PhoneFieldProps) {
  return (
    <div className="w-full">
       <style>{`
        .react-tel-input .country-list {
          z-index: 9999 !important;
          max-height: 200px !important;
        }
      `}</style>
      <label className="block text-sm font-medium mb-1">Phone</label>

      <PhoneInput
        country="md"
        value={value}
        onChange={onChange}
        enableSearch
       inputClass="!w-full !h-[42px] !border !rounded-lg !pl-14 !text-sm"
        containerClass="!w-full"
        buttonClass="!border-r !border-gray-300 !bg-white !rounded-l-lg"
        dropdownClass="!w-72 !text-sm"
        searchClass="!w-full !px-2 !py-1 !text-sm"
      />
    </div>
  );
}