"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";

const dojoDataTypes = [
  "# u8",
  "# u16",
  "# u32",
  "# u64",
  "# u128",
  "# u256",
  "ContractAddress",
];

export default function DatatypeDropdown() {
  const [selectedDatatype, setSelectedDatatype] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectChange = (value: string) => {
    setSelectedDatatype(value);
  };

  const filteredDatatypes = dojoDataTypes.filter((datatype) =>
    datatype.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Select onValueChange={handleSelectChange}>
      <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md shadow-sm text-gray-400">
        <SelectValue placeholder="Select a datatype" />
      </SelectTrigger>
      <SelectContent className="w-full bg-white border border-gray-300 rounded-md shadow-lg">
        <div className="relative w-full px-2 py-2 border-b border-gray-300">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2 py-1 border-none focus:outline-none"
          />
        </div>
        {filteredDatatypes.map((datatype) => (
          <SelectItem key={datatype} value={datatype}>
            {datatype}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
