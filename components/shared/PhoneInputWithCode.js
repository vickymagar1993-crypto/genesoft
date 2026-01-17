'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

// Country codes data
const countryCodes = [
  { code: '+1', country: 'US/CA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+55', country: 'BR', flag: '🇧🇷' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', country: 'SG', flag: '🇸🇬' },
  { code: '+82', country: 'KR', flag: '🇰🇷' },
  { code: '+39', country: 'IT', flag: '🇮🇹' },
  { code: '+34', country: 'ES', flag: '🇪🇸' },
  { code: '+31', country: 'NL', flag: '🇳🇱' },
  { code: '+46', country: 'SE', flag: '🇸🇪' },
  { code: '+47', country: 'NO', flag: '🇳🇴' },
  { code: '+41', country: 'CH', flag: '🇨🇭' },
  { code: '+52', country: 'MX', flag: '🇲🇽' },
  { code: '+27', country: 'ZA', flag: '🇿🇦' },
];

const PhoneInputWithCode = ({ value, onChange, countryCode, onCountryCodeChange, id }) => (
  <div className="flex gap-2">
    <Select value={countryCode} onValueChange={onCountryCodeChange}>
      <SelectTrigger className="w-[110px]">
        <SelectValue placeholder="Code" />
      </SelectTrigger>
      <SelectContent>
        {countryCodes.map((c) => (
          <SelectItem key={c.code} value={c.code}>
            {c.flag} {c.code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <Input
      id={id}
      type="tel"
      value={value}
      onChange={onChange}
      placeholder="Phone number"
      className="flex-1"
    />
  </div>
);

export default PhoneInputWithCode;
