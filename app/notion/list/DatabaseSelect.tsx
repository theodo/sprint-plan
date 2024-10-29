import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DatabaseOption = {
  id: string;
  name: string;
};

export const DatabaseSelect: React.FC<{
  options: DatabaseOption[];
  onSelect: (value: string) => void;
}> = ({ options, onSelect }) => {
  return (
    <div>
      <Select onValueChange={onSelect}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Select a database" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
