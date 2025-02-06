import { Button } from "@headlessui/react";
import TextIcon from "../assets/text.svg?react";
import ImageIcon from "../assets/img.svg?react";
import LogoIcon from "../assets/logo.svg?react";
import ResetIcon from "../assets/reset.svg?react";
import BackgroundIcon from "../assets/background.svg?react";
import ContentButton from "./ContentButton";

interface CanvasPanelProps {
  resetCanvas: () => void;
  addText: () => void;
  addImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  exportToPNG: () => void;
  setEditorBackground: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CanvasPanel: React.FC<CanvasPanelProps> = ({
  resetCanvas,
  addText,
  addImage,
  exportToPNG,
  setEditorBackground,
}) => {
  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex justify-between items-center h-75">
        <div className="flex items-center">
          <LogoIcon className="size-64 mr-10 fill-primary" />
          <h1 className="text-display text-black75">CanvasEditor</h1>
        </div>
        <button
          onClick={resetCanvas}
          className="flex items-center gap-1 text-red text-button cursor-pointer"
        >
          Reset
          <ResetIcon className="size-32 fill-red ml-5" />
        </button>
      </div>

      <div className="w-full h-75 items-center flex rounded-[10px] bg-white97 gap-20 pl-16 text-black-100">
        <p className="font-semibold text-button">Add content</p>
      </div>

      <div className="rounded-lg my-40">
        <div className="grid grid-cols-2 gap-20">
          <ContentButton icon={TextIcon} label="Text" onClick={addText} />
          <ContentButton
            icon={ImageIcon}
            label="Image"
            onClick={addImage}
            isFileInput
          />
          <ContentButton
            icon={BackgroundIcon}
            label="Background"
            onClick={setEditorBackground}
            isFileInput
          />
        </div>
      </div>

      <div className="w-full flex justify-end">
        <Button
          className="bg-primary text-white px-4 py-2 rounded w-170 h-40 cursor-pointer"
          onClick={exportToPNG}
        >
          Export to PNG
        </Button>
      </div>
    </div>
  );
};

export default CanvasPanel;
