import React from "react";

interface IProps {
  name: string;
  value?: string;
  setValue?: (value: string) => void;
  defaultOption?: string;
  options: string[];
  className?: string;
}

const Select: React.FC<IProps> = ({
  name,
  value,
  setValue,
  defaultOption,
  options,
  className,
}) => {
  return (
    <select
      name={name}
      value={value}
      id=""
      className={className ? className : "focus:outline-none"}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
        setValue(e.target.value)
      }
    >
      {defaultOption ? (
        <option value="" disabled hidden>
          {defaultOption}
        </option>
      ) : null}
      {options.map((value) => {
        return <option value={value}>{value}</option>;
      })}
    </select>
  );
};

export default Select;
