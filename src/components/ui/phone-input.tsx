
"use client";

import * as React from "react"
import { Check, ChevronsUpDown, QrCode } from "lucide-react"

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

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const [open, setOpen] = React.useState(false)
    const [scannerOpen, setScannerOpen] = React.useState(false);
    const [selectedCountry, setSelectedCountry] = React.useState(countries[0])

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
      const newPhoneNumber = e.target.value;
      const countryCode = selectedCountry.code;
      const fullNumber = `${countryCode} ${newPhoneNumber.replace(countryCode, '').trim()}`;
      onChange?.(fullNumber);
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
                placeholder="555 123 4567"
                className="rounded-l-none pr-10"
                value={displayPhoneNumber}
                onChange={handlePhoneNumberChange}
                ref={ref}
                {...props}
            />
            <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
                <DialogTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute inset-y-0 right-0 h-full px-3"
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
    )
  }
);
PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
