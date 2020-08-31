import React from "react";
import Downshift, { DownshiftProps, DownshiftInterface } from "downshift";
import classNames from "classnames";

import { Option } from "../model/Option";

interface WaypointInputProps {
  index: number;
  inputValue: string;
  selectedItem: Option | null;
  onInputChange: { (value: string): any };
  onSelectionChange: { (selection: Option): any };
  options?: Option[];
}

const TypedDownshift = Downshift as DownshiftInterface<Option>;
type TypedDownshiftProps = DownshiftProps<Option>;

const WaypointInput: React.FunctionComponent<WaypointInputProps> = ({
  inputValue,
  selectedItem,
  options = [],
  onInputChange,
  onSelectionChange
}) => {
  const handleStateChange: TypedDownshiftProps["onStateChange"] = ({
    type,
    highlightedIndex,
    inputValue
  }) => {
    if (typeof highlightedIndex === "number")
      onSelectionChange(options[highlightedIndex]);
    else if (type === TypedDownshift.stateChangeTypes.changeInput && inputValue)
      onInputChange(inputValue);
  };

  return (
    <TypedDownshift
      itemToString={item => (item ? item.name : "")}
      onStateChange={handleStateChange}
      selectedItem={selectedItem}
      inputValue={selectedItem ? selectedItem.name : inputValue}
    >
      {({
        getInputProps,
        getItemProps,
        getMenuProps,
        isOpen,
        highlightedIndex
      }) => (
        <div className="field is-relative">
          <input
            {...getInputProps({
              className: "input",
              type: "text"
            })}
            onBlur={() => {}}
          />
          <div {...getMenuProps()}>
            {isOpen && options.length > 0 && (
              <div className="dropdown-menu is-block">
                <div className="dropdown-content">
                  {options.map((item, index) => (
                    <a
                      {...getItemProps({
                        key: item.id,
                        index,
                        item,
                        className: classNames("dropdown-item", {
                          "is-active": highlightedIndex === index
                        })
                      })}
                    >
                      {item.name} <small>{item.near}</small>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </TypedDownshift>
  );
};

export default WaypointInput;
