import React, { useEffect, useState } from "react";
import Giscus from "@giscus/react";
import { GISCUS } from "@config";

const WrapperStyles = {
  minHeight: "200px",
};

const Comment: React.FC<{ title: string }> = ({ title }) => {
  const isProd = import.meta.env.PROD;

  const [theme, setTheme] = useState(() => {
    const currentTheme = localStorage.getItem("theme");
    const browserTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    return currentTheme || browserTheme;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = ({ matches }: MediaQueryListEvent) => {
      setTheme(matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const themeButton = document.querySelector("#theme-btn");
    const handleClick = () => {
      setTheme(prevTheme => (prevTheme === "dark" ? "light" : "dark"));
    };

    themeButton?.addEventListener("click", handleClick);

    return () => themeButton?.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      {isProd && (
        <div className={"mb-8 pt-8"} style={WrapperStyles}>
          <Giscus {...GISCUS} term={title} theme={theme} />
        </div>
      )}
    </>
  );
};

export default Comment;
