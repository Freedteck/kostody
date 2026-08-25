import { ChipSet, FilterChip } from "./md";
import Icon from "./Icon";

const FilterChips = ({ options, value, onChange, className, style }) => (
  <ChipSet className={className} style={style} role="listbox">
    {options.map((opt) => {
      const selected = value === opt.value;
      return (
        <FilterChip
          key={String(opt.value)}
          label={opt.label}
          selected={selected}
          onClick={() => onChange(opt.value)}
        >
          {selected && opt.icon && (
            <Icon slot="icon" name={opt.icon} size={18} />
          )}
        </FilterChip>
      );
    })}
  </ChipSet>
);

export default FilterChips;
