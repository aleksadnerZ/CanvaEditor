import React from "react";

interface ContentButtonProps {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  onClick: (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => void;
  isFileInput?: boolean;
}

const ContentButton: React.FC<ContentButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  isFileInput,
}) => {
  return isFileInput ? (
    <label className="bg-white97 p-10 w-full text-center flex items-center justify-center flex-col rounded-[10px] text-body cursor-pointer">
      <Icon className="size-128 fill-black75" />
      <input
        type="file"
        accept="image/*"
        onChange={onClick as React.ChangeEventHandler<HTMLInputElement>}
        className="hidden"
      />
      {label}
    </label>
  ) : (
    <button
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      className="bg-white97 p-10 w-full text-center flex items-center justify-center flex-col rounded-[10px] text-body cursor-pointer"
    >
      <Icon className="size-128 fill-black75" />
      {label}
    </button>
  );
};

export default ContentButton;
