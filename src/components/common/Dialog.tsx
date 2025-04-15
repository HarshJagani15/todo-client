import React from "react";
import { IDialogProps } from "./common.model";

const Dialog: React.FC<IDialogProps> = ({ isOpen, children }) => {
  if (!isOpen) return null;
  return (
    <React.Fragment>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        {children}
      </div>
    </React.Fragment>
  );
};

export default Dialog;
