import React, { useEffect, useState } from "react";
import Giscus from "@giscus/react";
import { GISCUS } from "@config";

const WrapperStyles = {
  minHeight: "200px",
};

const Comment: React.FC<{ title: string }> = ({ title }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const getCurrentTheme = () =>
      localStorage.getItem("theme") as "light" | "dark";

    const currentTheme = getCurrentTheme();

    if (currentTheme) {
      setTheme(currentTheme);
    }

    const observer = new MutationObserver(() => {
      const currentTheme = getCurrentTheme();

      setTheme(currentTheme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={'mb-8 pt-8'} style={WrapperStyles}>
      <Giscus {...GISCUS} term={title} theme={theme} />
    </div>
  );
};

export default Comment;
