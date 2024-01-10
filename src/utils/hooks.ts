import React, { useEffect, useState } from "react";

const useMounted = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return mounted;
};

const useMutationObserver = (
  ref: React.RefObject<Node>,
  callback: MutationCallback,
  options = {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  }
) => {
  useEffect(() => {
    if (ref.current) {
      const observer = new MutationObserver(callback);
      observer.observe(ref.current, options);
      return () => observer.disconnect();
    }
  }, [callback, options]);
};

export { useMounted, useMutationObserver };
