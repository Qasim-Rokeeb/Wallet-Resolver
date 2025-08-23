
"use client";

import * as React from "react"
import { Check, ChevronsUpDown, QrCode, X } from "lucide-react"

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
import { Input } from "./input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { QrCodeScanner } from "../wallet-resolver/qr-code-scanner";

const countries = [
  { value: "us", label: "🇺🇸 United States", code: "+1" },
  { value: "gb", label: "🇬🇧 United Kingdom", code: "+44" },
  { value: "ca", label: "🇨🇦 Canada", code: "+1" },
  { value: "au", label: "🇦🇺 Australia", code: "+61" },
  { value: "de", label: "🇩🇪 Germany", code: "+49" },
  { value: "fr", label: "🇫🇷 France", code: "+33" },
  { value: "jp", label: "🇯🇵 Japan", code: "+81" },
  { value: "in", label: "🇮🇳 India", code: "+91" },
  { value: "br", label: "🇧🇷 Brazil", code: "+55" },
  { value: "za", label: "🇿🇦 South Africa", code: "+27" },
];

export interface PhoneInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onChange?: (value: string) => void;
}

const formatPhoneNumber = (value: string): string => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
        return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3)}`;
    }
    return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6, 10)}`;
};


const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const [open, setOpen] = React.useState(false)
    const [scannerOpen, setScannerOpen] = React.useState(false);
    const [selectedCountry, setSelectedCountry] = React.useState(countries[0])
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);


    const handleCountrySelect = (currentValue: string) => {
      const country = countries.find((c) => c.value === currentValue);
      if (country) {
        setSelectedCountry(country);
        const phoneNumber = value?.split(' ')[1] || '';
        onChange?.(`${country.code} ${phoneNumber}`);
      }
      setOpen(false)
    }

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target;
      const formattedNumber = formatPhoneNumber(input.value);
      const countryCode = selectedCountry.code;
      const fullNumber = `${countryCode} ${formattedNumber}`;

      // This is to maintain the cursor position
      const selectionStart = input.selectionStart;
      const originalLength = input.value.length;
      const newLength = formattedNumber.length;
      
      onChange?.(fullNumber);

      if (selectionStart !== null) {
          const newPosition = selectionStart + (newLength - originalLength);
          setTimeout(() => {
              inputRef.current?.setSelectionRange(newPosition, newPosition);
          }, 0);
      }
    };

    const handleQrScan = (scannedValue: string) => {
        let phoneNumber = scannedValue;
        if (phoneNumber.startsWith('tel:')) {
            phoneNumber = phoneNumber.substring(4);
        }
        
        const country = countries.find(c => phoneNumber.startsWith(c.code));
        if (country) {
            setSelectedCountry(country);
            onChange?.(phoneNumber);
        } else {
             onChange?.(`${selectedCountry.code} ${phoneNumber}`);
        }
        setScannerOpen(false);
    };

    const displayPhoneNumber = value?.replace(selectedCountry.code, '').trim() || '';

    const handleClear = () => {
        onChange?.(`${selectedCountry.code} `);
    }

    return (
      <div className={cn("flex items-center", className)}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between w-28 rounded-r-none border-r-0"
            >
              {selectedCountry.label.split(' ')[0]}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-0">
            <Command>
              <CommandInput placeholder="Search country..." />
              <CommandList>
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandGroup>
                  {countries.map((country) => (
                    <CommandItem
                      key={country.value}
                      value={country.value}
                      onSelect={handleCountrySelect}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCountry.value === country.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {country.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <div className="relative flex-grow">
            <Input
                type="tel"
                className="rounded-l-none pr-20"
                value={displayPhoneNumber}
                onChange={handlePhoneNumberChange}
                ref={inputRef}
                {...props}
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
                {displayPhoneNumber && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-full px-3 rounded-none"
                        onClick={handleClear}
                        aria-label="Clear phone number"
                    >
                        <X className="h-4 w-4 text-muted-foreground" />
                    </Button>
                )}
                <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
                    <DialogTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-full px-3 rounded-l-none"
                            aria-label="Scan QR code"
                        >
                            <QrCode className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                         <DialogHeader>
                            <DialogTitle>Scan QR Code</DialogTitle>
                        </DialogHeader>
                        <QrCodeScanner onScan={handleQrScan} />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
      </div>
    )
  }
);
PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
