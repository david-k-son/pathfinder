import React from "react";
import { useState } from "react";
import "./DropdownMenu.css";

export default function DropdownMenu({ title, options, selection }) {
  const [openDropDown, setOpenDropDown] = useState(false);
  return (
    <div
      className="dropdown-menu"
      onClick={() => setOpenDropDown((prev) => !prev)}
    >
      {title}
      {openDropDown && (
        <ul className="dropdown-menu-list">
          {options.map((option, optionIdx) => {
            return (
              <li
                key={`dropdownmenuoption-${optionIdx}`}
                className="dropdown-menu-item"
                onClick={() => selection(option)}
              >
                {option}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
