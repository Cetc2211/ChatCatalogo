"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type ComboboxOption = {
  value: string;
  label: string;
};

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  createLabel?: string;
  onCreate?: (value: string) => void;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  createLabel = "Create",
  onCreate,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('');

  const handleCreate = () => {
    if (inputValue && !options.some(opt => opt.label.toLowerCase() === inputValue.toLowerCase())) {
      if (onCreate) {
        onCreate(inputValue);
      } else {
        onChange(inputValue);
      }
      setOpen(false);
      setInputValue('');
    }
  }

  const currentLabel = options.find((option) => option.value.toLowerCase() === value?.toLowerCase())?.label || value;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="truncate">
            {value ? currentLabel : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput 
            placeholder="Buscar o crear..." 
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            {inputValue && !options.some(opt => opt.label.toLowerCase() === inputValue.toLowerCase()) && (
              <CommandItem
                onSelect={handleCreate}
                className="cursor-pointer"
              >
                {createLabel}: "{inputValue}"
              </CommandItem>
            )}
            <CommandEmpty>No se encontraron opciones.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={(currentLabel) => {
                    const selectedValue = options.find(opt => opt.label.toLowerCase() === currentLabel.toLowerCase())?.value || '';
                    onChange(selectedValue === value ? "" : selectedValue);
                    setOpen(false);
                    setInputValue('');
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value && value.toLowerCase() === option.value.toLowerCase() ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
