import { FiGithub } from "solid-icons/fi";
import { panelSize } from "../SettingsPanel/SettingsPanel";
import SolidLogo from "../SolidLogo";
import ThemeBtn from "./ThemeBtn";

const Header = () => {
  return (
    <header
      id="header"
      class={`fixed h-50px px-3 py-10px ${panelSize} top-0px left-0px md:(h-60px py-3) dark:bg-dark bg-white z-10`}
    >
      <div class="flex justify-between items-center gap-4 h-full relative z-1">
        <div class="flex gap-2 md:gap-3 items-center h-full">
          <SolidLogo />
          <h1 class="text-14px dark:text-light font-500 md:text-18px w-min leading-1em opacity-80 font-sans">
            <span class="whitespace-nowrap">HTML To</span> SolidJSX
          </h1>
        </div>
        <nav id="header-nav">
          <ul class="flex">
            <li>
              <ThemeBtn />
            </li>
            <li>
              <a
                class="flex justify-center items-center w-45px h-45px dark:text-solid-mediumgray text-solid-gray/80 rounded-full hover:(text-black bg-#F2F2F2) dark:hover:(text-white bg-#333) transition"
                href="https://github.com/solidjs-community/html-to-solidjsx"
                aria-label="Github repository of html-to-solidjsx"
                rel="noreferrer noopener"
              >
                <FiGithub />
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div
        id="header-fake-bg"
        class="absolute inset-0px dark:bg-dark bg-white border-b-2 md:border-r-2 border-#CFCFCF dark:border-#555"
      />
    </header>
  );
};

export default Header;
