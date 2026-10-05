import { useRef, useState } from "react";

const DRAG_START_DISTANCE = 6; // px before a mouse press counts as a drag

/**
 * Drag-to-scroll with the mouse for any horizontally scrollable element.
 * (Touch screens already scroll natively; a mouse needs this hook.)
 *
 * Usage:
 *   const listRef = useRef(null);
 *   const { isDragging, handlers } = useDragScroll(listRef);
 *   <ul ref={listRef} className={isDragging ? "is-dragging" : ""} {...handlers}>
 *
 * While dragging, give the element in CSS:
 *   scroll-snap-type: none;  cursor: grabbing;  user-select: none;
 */
export function useDragScroll(ref) {
  const [isDragging, setIsDragging] = useState(false);

  const startXRef = useRef(null);
  const startScrollRef = useRef(0);
  const movedRef = useRef(false);

  const onPointerDown = (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;

    startXRef.current = event.clientX;
    startScrollRef.current = ref.current.scrollLeft;
    movedRef.current = false;
  };

  const onPointerMove = (event) => {
    if (startXRef.current === null) return;

    const delta = event.clientX - startXRef.current;

    if (!movedRef.current && Math.abs(delta) > DRAG_START_DISTANCE) {
      movedRef.current = true;
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    // scrollLeft follows the physical direction, so this works in RTL too
    if (movedRef.current) {
      ref.current.scrollLeft = startScrollRef.current - delta;
    }
  };

  const finishDrag = () => {
    startXRef.current = null;
    setIsDragging(false);
  };

  /* A drag must not open the link under the cursor */
  const onClickCapture = (event) => {
    if (movedRef.current) {
      event.preventDefault();
      event.stopPropagation();
      movedRef.current = false;
    }
  };

  /* Stops the browser's own "drag the link/image" ghost */
  const onDragStart = (event) => event.preventDefault();

  return {
    isDragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: finishDrag,
      onPointerCancel: finishDrag,
      onClickCapture,
      onDragStart,
    },
  };
}