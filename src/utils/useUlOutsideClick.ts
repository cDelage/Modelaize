import { useEffect, useRef, MutableRefObject } from "react";

type OutsideClickHandler = () => void;

export function useUlOutsideClick(
  handler: OutsideClickHandler,
  listenCapturing = true
): MutableRefObject< HTMLUListElement | null> {
  const ref = useRef< HTMLUListElement | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler();
      }
    }

    document.addEventListener("click", handleClick, listenCapturing);

    return () =>
      document.removeEventListener("click", handleClick, listenCapturing);
  }, [handler, listenCapturing]);

  return ref;
}