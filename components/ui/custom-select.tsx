import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

type Option = {
    label: string;
    value: string;
    disabled?: boolean;
};

interface CustomSelectProps {
    options: Option[];
    defaultValue?: string;
    className?: string;
    gap?: string;
    dropdownMinWidth?: string;
    left?: boolean;
    onValueChange?: (value: string) => void; // Optional callback
}

export default function CustomSelect({
    options,
    defaultValue,
    className = "",
    gap = "3",
    dropdownMinWidth = "80px",
    left = true,
    onValueChange,
}: CustomSelectProps) {
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(
        defaultValue || options[0]?.value || ""
    );
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    const selectedOption = options.find((opt) => opt.value === selectedValue);

    const handleSelect = (value: string) => {
        setSelectedValue(value);
        setOpen(false);
        onValueChange?.(value); // Optional callback
    };

    return (
        <div className="relative text-xs/4" ref={ref}>
            <button
                className={cn(
                    "bg-transparent text-white focus:outline-none select-none cursor-pointer",
                    className
                )}
                onClick={() => setOpen((o) => !o)}
                type="button"
            >
                <div
                    className={`flex items-center text-xs/4 gap-${gap} ${
                        left ? "justify-start" : "justify-end"
                    }`}
                >
                    <span>{selectedOption?.label || "Select..."}</span>
                    {open ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                    )}
                </div>
            </button>
            {open && (
                <div
                    className={`absolute mt-1 z-12 left-0 min-w-[${dropdownMinWidth}] w-full px-2 py-1 flex flex-col bg-[#151c20] rounded shadow-lg animate-fade-in rounded-md`}
                >
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            className={cn(
                                "w-full text-left py-1 text-xs",
                                opt.disabled
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-400 hover:text-white",
                                selectedValue === opt.value &&
                                    "text-white font-medium"
                            )}
                            onClick={() => {
                                if (!opt.disabled) {
                                    handleSelect(opt.value);
                                }
                            }}
                            disabled={opt.disabled}
                            type="button"
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
