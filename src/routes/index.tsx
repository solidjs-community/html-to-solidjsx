import ActionsPanel from "~/components/ActionsPanel/ActionsPanel";
import SplitEditor from "~/components/Editors/SplitEditor";
import Header from "~/components/Header/Header";
import SettingsPanel from "~/components/SettingsPanel/SettingsPanel";

export default function Home() {
  return (
    <>
      <Header />
      <main
        id="main"
        class="flex flex-col-reverse pt-50px md:(grid grid-cols-[auto_1fr] pt-0 grid-rows-[100%]) overflow-clip dark:bg-dark"
      >
        <div
          id="settings-panel-container"
          class="grid grid-rows-[min-content_1fr] md:block min-h-220px h-30vh max-h-400px md:(h-full max-h-none min-h-auto)"
        >
          <ActionsPanel />
          <SettingsPanel />
        </div>
        <SplitEditor />
      </main>
    </>
  );
}
