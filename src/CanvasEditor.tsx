import { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import MoveIcon from "./assets/move.svg?react";
import DeleteIcon from "./assets/delete.svg?react";

type CanvasElement = {
  id: number;
  type: "text" | "image";
  color?: string;
  src?: string;
  fontSize?: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
};

const useDraggableResize = (
  el: CanvasElement,
  updateElement: (id: number, changes: Partial<CanvasElement>) => void,
  onDragStopSuccess?: () => void
) => {
  const onDragStop = (_e: unknown, d: { x: number; y: number }) => {
    updateElement(el.id, { x: d.x, y: d.y });
    if (onDragStopSuccess) {
      onDragStopSuccess();
    }
  };

  const onResize = (
    _e: unknown,
    _direction: unknown,
    ref: HTMLDivElement,
    _delta: unknown,
    position: { x: number; y: number }
  ) => {
    const newWidth = ref.offsetWidth;
    const newHeight = ref.offsetHeight;
    const scaleFactor = newWidth / (el.width || 200);

    updateElement(el.id, {
      width: newWidth,
      height: newHeight,
      fontSize:
        el.type === "text" ? (el.fontSize || 16) * scaleFactor : undefined,
      x: position.x,
      y: position.y,
    });
  };

  return { onDragStop, onResize };
};

const useElementVisibility = (onBlurSuccess?: () => void) => {
  const [showControls, setShowControls] = useState(true);
  const elementRef = useRef<any>(null);

  useEffect(() => {
    setTimeout(() => {
      if (elementRef.current?.resizableElement?.current) {
        const element = elementRef.current.resizableElement.current;
        element.setAttribute("tabIndex", "0");
        element.focus();
      }
    }, 0);
  }, []);

  const hideControls = () => {
    setShowControls(false);
  };

  const showControlsHandler = () => setShowControls(true);

  const handleBlur = (e: FocusEvent) => {
    if (
      typeof onBlurSuccess === "function" &&
      elementRef.current?.resizableElement?.current &&
      !elementRef.current.resizableElement.current.contains(
        e.relatedTarget as Node
      )
    ) {
      onBlurSuccess();
    }
  };

  return {
    showControls,
    showControlsHandler,
    hideControls,
    elementRef,
    handleBlur,
  };
};

const ColorPicker = ({
  updateElement,
  el,
  colorOptions,
}: {
  updateElement: (id: number, changes: Partial<CanvasElement>) => void;
  el: CanvasElement;
  colorOptions: string[];
}) => {
  return (
    <div className="absolute -bottom-30 -left-0 transform -translate-x-1 flex">
      {colorOptions.map((color) => (
        <label
          key={color}
          className="relative flex items-center justify-center"
        >
          <input
            type="radio"
            name={`color-${el.id}`}
            value={color}
            checked={el.color === color}
            onChange={() => updateElement(el.id, { color })}
            className="hidden"
          />
          <span
            className={`relative flex items-center justify-center cursor-pointer transition-all rounded-full size-24 border-2 border-transparent ${
              el.color === color ? "border-white" : ""
            }`}
          >
            <span
              className="block size-16 rounded-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ backgroundColor: color }}
            ></span>
          </span>
        </label>
      ))}
    </div>
  );
};

const EditableElement = ({
  el,
  removeElement,
  updateElement,
  children,
  displayColorPicker,
  hideControlsOnMoveEnd,
  colorOptions,
  hideControlsOnBlur,
}: {
  el: CanvasElement;
  removeElement: (id: number) => void;
  updateElement: (id: number, changes: Partial<CanvasElement>) => void;
  children: React.ReactNode;
  displayColorPicker?: boolean;
  hideControlsOnMoveEnd?: boolean;
  colorOptions: string[];
  hideControlsOnBlur?: boolean;
}) => {
  const [isBlurred, setIsBlurred] = useState(false);
  const [isMovedEnded, setIsMovedEnded] = useState(false);

  const { elementRef, handleBlur } = useElementVisibility(
    hideControlsOnBlur ? () => setIsBlurred(true) : undefined
  );

  const { onDragStop, onResize } = useDraggableResize(
    el,
    updateElement,
    hideControlsOnMoveEnd ? () => setIsMovedEnded(true) : undefined
  );

  const showControls = !(isBlurred || isMovedEnded);

  return (
    <Rnd
      default={{
        x: el.x || 50,
        y: el.y || 50,
        width: el.width || 350,
        height: el.height || 120,
      }}
      onDragStop={onDragStop}
      onResize={onResize}
      dragHandleClassName="drag-handle"
      resizeHandleComponent={{
        bottomRight: (
          <div className="size-24 bg-purple-500 rounded-full cursor-se-resize border-4 border-white resize-handle"></div>
        ),
      }}
      bounds="parent"
      enableResizing={showControls ? { bottomRight: true } : false}
      className={
        showControls ? "border-2 border-purple-500" : "border-transparent w-1/2"
      }
      onBlur={handleBlur}
      ref={elementRef}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {!isBlurred && (
          <div className="absolute -top-21 -left-21 size-40 bg-white rounded-full flex items-center justify-center drag-handle cursor-move">
            <MoveIcon alt="Move" className="fill-primary" />
          </div>
        )}
        {children}
        {displayColorPicker && showControls && (
          <ColorPicker
            updateElement={updateElement}
            el={el}
            colorOptions={colorOptions}
          />
        )}
        {showControls && (
          <button
            onClick={removeElement(el.id)}
            className="absolute -top-13 -right-13 size-24 bg-red-500 text-white bg-white rounded-full flex items-center justify-center"
          >
            <DeleteIcon alt="Delete" className="size-18 fill-red" />
          </button>
        )}
      </div>
    </Rnd>
  );
};

const EditableText = ({ el }: { el: CanvasElement }) => (
  <input
    type="text"
    className="p-2 w-full h-full max-w-full max-h-full overflow-hidden outline-none text-center bg-transparent focus:ring-0 text-body placeholder-opacity-25"
    style={{ fontSize: el.fontSize, color: el.color }}
    placeholder="Lorem Ipsum"
  />
);

const EditableImage = ({ el }: { el: CanvasElement }) => (
  <img src={el.src} alt="Uploaded" className="w-full h-full object-cover" />
);

const CanvasEditor = ({
  elements,
  removeElement,
  updateElement,
  backgroundImage,
  colorOptions,
}: {
  elements: CanvasElement[];
  removeElement: (id: number) => void;
  updateElement: (id: number, changes: Partial<CanvasElement>) => void;
  backgroundImage?: string;
  colorOptions: string[];
}) => (
  <div
    className="h-full bg-myGrey"
    id="editor"
    style={{
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {elements.map((el) => {
      const isTextElement = el.type === "text";
      return (
        <EditableElement
          key={el.id}
          el={el}
          removeElement={removeElement}
          updateElement={updateElement}
          displayColorPicker={isTextElement}
          hideControlsOnMoveEnd={!isTextElement}
          colorOptions={colorOptions}
          hideControlsOnBlur
        >
          {isTextElement ? <EditableText el={el} /> : <EditableImage el={el} />}
        </EditableElement>
      );
    })}
  </div>
);

export default CanvasEditor;
