import { usePrefersDark } from "@solid-primitives/media";
import { FiMoon, FiSun } from "solid-icons/fi";
import {
  createComputed,
  createEffect,
  createSignal,
  Match,
  on,
  onMount,
  Switch,
} from "solid-js";
import { isServer } from "solid-js/web";
import HalfSun from "../Icons/HalfSun";

const [_currentTheme, setCurrentTheme] = createSignal<"light" | "dark" | "os">(
  !isServer ? localStorage.theme || "os" : "os"
);

export const isDarkTheme = () => {
  const _prefersDark = usePrefersDark();
  const prefersDark = _prefersDark();
  const currentTheme = _currentTheme();

  if (currentTheme === "os") {
    // solid-codemirror probably fails to update theme because it initializes after usePrefersDark updates.
    // so this redundant matchMedia is to get correct dark matches value on initial load
    if (!isServer) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    return prefersDark;
  }
  return currentTheme === "dark";
};

const ThemeBtn = () => {
  const [theme, setTheme] = createSignal<"light" | "dark" | "os">("os");
  const prefersDark = usePrefersDark();

  const onClickTheme = () => {
    switch (theme()) {
      // 1. OS (default dark)
      // 2. user light
      // 3. user dark
      // 4. OS (default dark)
      case "dark":
        {
          if (prefersDark()) {
            document.documentElement.classList.add("dark");
            localStorage.removeItem("theme");
            setTheme("os");
          } else {
            document.documentElement.classList.remove("dark");
            localStorage.theme = "light";
            setTheme("light");
          }
        }
        break;
      // 1. OS (default light)
      // 2. user dark
      // 3. user light
      // 4. OS (default light)
      case "light":
        {
          if (prefersDark()) {
            document.documentElement.classList.add("dark");
            localStorage.theme = "dark";
            setTheme("dark");
          } else {
            localStorage.removeItem("theme");
            setTheme("os");
          }
        }
        break;
      default: {
        if (!prefersDark()) {
          document.documentElement.classList.add("dark");
          localStorage.theme = "dark";
          setTheme("dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.theme = "light";
          setTheme("light");
        }
      }
    }
  };

  createComputed(
    on(
      theme,
      () => {
        setCurrentTheme(theme());
      },
      { defer: true }
    )
  );

  createEffect(
    on(
      prefersDark,
      (prefersDark) => {
        if (theme() !== "os") return;

        if (prefersDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },
      { defer: true }
    )
  );

  onMount(() => {
    let lsTheme = localStorage.theme;
    if (!lsTheme) lsTheme = "os";

    setTheme(lsTheme);
  });

  return (
    <button
      class="w-45px h-45px flex justify-center items-center rounded-full dark:text-solid-mediumgray text-solid-gray/80 rounded-full hover:(text-black bg-#F2F2F2) dark:hover:(text-white bg-#333) transition"
      onClick={onClickTheme}
      aria-label={`theme. Currently on ${theme()} theme`}
    >
      <Switch>
        <Match when={theme() === "os"}>
          <HalfSun />
        </Match>
        <Match when={theme() === "light"}>
          <FiSun />
        </Match>
        <Match when={theme() === "dark"}>
          <FiMoon />
        </Match>
      </Switch>
    </button>
  );
};

export default ThemeBtn;
