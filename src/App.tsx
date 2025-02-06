import CanvasPanel from "./CanvasPanel/CanvasPanel";
import CanvasEditor from "./CanvasEditor";

import { useState } from "react";
import { toPng } from "html-to-image";

const defaultSet = {
  bgColor: "#e9d5ff",
  pngSize: {
    width: 1080,
    height: 1350,
  },
};

const colorOptions: string[] = [
  "#353535",
  "#fff",
  "#cf0000",
  "#0055FF",
  "#00da16",
];

type ElementType = {
  id: number;
  type: "text" | "image";
  color?: string;
  src?: string;
  scale: number;
};

const useCanvasElements = () => {
  const [elements, setElements] = useState<ElementType[]>([]);
  const [bgColor, setBgColor] = useState<string>(defaultSet.bgColor);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  const addText = (): void => {
    setElements((prev) => [
      ...prev,
      {
        type: "text",
        color: colorOptions[0],
        id: Date.now(),
        scale: 1,
      },
    ]);
  };

  const setEditorBackground = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addImage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setElements((prev) => [
          ...prev,
          {
            type: "image",
            src: e.target?.result as string,
            id: Date.now(),
            scale: 1,
          },
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeElement =
    (id: number) =>
    (e: React.MouseEvent<HTMLButtonElement>): void => {
      e.stopPropagation();
      setElements((prev) => prev.filter((el) => el.id !== id));
    };

  const updateElement = (id: number, changes: Partial<ElementType>): void => {
    setElements((prevElements) =>
      prevElements.map((el) => (el.id === id ? { ...el, ...changes } : el))
    );
  };

  const resetCanvas = (): void => {
    setElements([]);
    setBgColor(defaultSet.bgColor);
    setBackgroundImage(null);
  };

  const exportToPNG = (): void => {
    const node = document.getElementById("editor");
    if (!node) return;

    toPng(node, {
      width: defaultSet.pngSize.width,
      height: defaultSet.pngSize.height,
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "canvas.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => console.error("Export failed", err));
  };

  return {
    elements,
    bgColor,
    backgroundImage,
    colorOptions,
    addText,
    addImage,
    setEditorBackground,
    removeElement,
    updateElement,
    resetCanvas,
    exportToPNG,
    setBgColor,
  };
};

const App = () => {
  const {
    elements,
    bgColor,
    backgroundImage,
    colorOptions,
    addText,
    addImage,
    setEditorBackground,
    removeElement,
    updateElement,
    resetCanvas,
    exportToPNG,
    setBgColor,
  } = useCanvasElements();

  return (
    <div className="flex justify-between h-screen px-120 py-45">
      <div className="w-1/2 mr-20 max-w-759">
        <CanvasEditor
          bgColor={bgColor}
          elements={elements}
          removeElement={removeElement}
          updateElement={updateElement}
          backgroundImage={backgroundImage}
          colorOptions={colorOptions}
        />
      </div>

      <div className="w-1/2 max-w-759">
        <CanvasPanel
          resetCanvas={resetCanvas}
          addText={addText}
          addImage={addImage}
          bgColor={bgColor}
          setBgColor={setBgColor}
          exportToPNG={exportToPNG}
          setEditorBackground={setEditorBackground}
        />
      </div>
    </div>
  );
};

export default App;
