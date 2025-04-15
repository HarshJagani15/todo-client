import React from "react";
import { ISelectProps } from "./common.model";

const Select: React.FC<ISelectProps> = ({
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
      className={className ? className : "focus:outline-none"}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
        setValue(e.target.value)
      }
    >
      {defaultOption ? (
        <option value="" disabled hidden selected>
          {defaultOption}
        </option>
      ) : null}
      {options?.map((value) => {
        return <option value={value}>{value}</option>;
      })}
    </select>
  );
};

export default Select;
