import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import "./DropdownMenu.css";

export default function DropdownMenu({ title, options, selection }) {
  const [openDropDown, setOpenDropDown] = useState(false);
  return (
    <div
      className="dropdown-menu"
      onClick={() => setOpenDropDown((prev) => !prev)}
    >
      {title}
      <FontAwesomeIcon icon={faAngleDown} />
      {openDropDown && (
        <ul className="dropdown-menu-list">
          {options.map((option, optionIdx) => {
            return (
              <li
                key={`dropdownmenuoption-${optionIdx}`}
                className="dropdown-menu-item"
                onClick={() => selection(`${title}-${option}`)}
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
