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
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  createLabel = "Create",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [currentOptions, setCurrentOptions] = React.useState(options);
  const [inputValue, setInputValue] = React.useState('');

  React.useEffect(() => {
    setCurrentOptions(options);
  }, [options]);

  const handleCreate = () => {
    if (inputValue && !currentOptions.some(opt => opt.label.toLowerCase() === inputValue.toLowerCase())) {
      const newValue = inputValue;
      const newOption = { value: newValue, label: newValue };
      setCurrentOptions(prev => [...prev, newOption]);
      onChange(newValue);
      setOpen(false);
      setInputValue('');
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? currentOptions.find((option) => option.value === value)?.label
            : placeholder}
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
            <CommandEmpty onSelect={handleCreate} className="cursor-pointer p-2 text-sm">
                {createLabel}: "{inputValue}"
            </CommandEmpty>
            <CommandGroup>
              {currentOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    setInputValue('')
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
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
