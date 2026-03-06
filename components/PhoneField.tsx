"use client";

import { PhoneFieldProps } from "@/types";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function PhoneField({ value, onChange }: PhoneFieldProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-1">Phone</label>

      <PhoneInput
        country="md"
        value={value}
        onChange={onChange}
        enableSearch
        inputClass="!w-full !h-[42px] !border !rounded-lg !pl-12"
        containerClass="w-full"
        buttonClass="!border-none"
      />
    </div>
  );
}