import { useEffect, useRef, MutableRefObject } from "react";

type OutsideClickHandler = () => void;

export function useDivClickOutside(
  handler: OutsideClickHandler,
  listenCapturing = true
): MutableRefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).className.includes("menu-button")
      ) {
        handler();
      }
    }

    document.addEventListener("click", handleClick, listenCapturing);

    return () =>
      document.removeEventListener("click", handleClick, listenCapturing);
  }, [handler, listenCapturing]);

  return ref;
}
