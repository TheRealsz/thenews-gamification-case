import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./select";
import { Option } from "@/utils/create-options";

export interface IDynamicSelect {
    options: Option[];
    placeholder?: string;
    label: string;
    onChangeCallback?: (option: string) => void;
    defaultValue?: string | number;
    name?: string;
    isDisabled?: boolean;
}

export function DynamicSelect({
    options,
    placeholder,
    label,
    onChangeCallback,
    defaultValue,
    name,
    isDisabled
}: IDynamicSelect) {

    const onChange = (option: string) => {
        onChangeCallback && onChangeCallback(option);
    };

    return (
        <Select
            name={name}
            value={String(defaultValue)}
            onValueChange={(value) => onChange(value)}
            disabled={isDisabled}
        >
            <SelectTrigger className="w-full outline-none focus:ring-0 h-12">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem disabled value=" ">{label}</SelectItem>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
