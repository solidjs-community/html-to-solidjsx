import { $TRACK, createEffect, createSignal, For, on, onMount } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { HTMLtoJSXConfig } from "../../lib/html-to-jsx";
import {
  ConfigKey,
  defaultConfig,
  setStore,
  store,
  TJSXConfig,
} from "../../store";
import { debounce } from "@solid-primitives/scheduled";
import Select from "./Select";
import Input from "./Input";
import Toggle from "./Toggle";

const ConfigPanel = () => {
  const [configMap, setConfigMap] = createStore<{
    [key in keyof (HTMLtoJSXConfig & { prefixSVGIds?: string })]: {
      type: "input" | "checkbox" | "select";
      name: string;
      value: string | boolean;
      options?: string[];
      disabled?: boolean;
      disables?: { key: string; isValue: string | boolean }[];
      filter?: RegExp;
      placeholder?: string;
      maskType?: "character-count";
    };
  }>({
    attributeValueString: {
      type: "checkbox",
      name: "Attribute Value String",
      value: store.config.attributeValueString!,
    },
    camelCaseAttributes: {
      type: "checkbox",
      name: "Camel Case Attributes",
      value: store.config.camelCaseAttributes!,
    },
    styleAttribute: {
      type: "select",
      name: "Style Attribute",
      options: ["css-object", "css-string"],
      value: store.config.styleAttribute!,
    },
    wrapperNode: {
      type: "select",
      name: "Wrapper Node",
      options: ["none", "div", "fragment"],
      value: store.config.wrapperNode!,
    },
    component: {
      type: "select",
      name: "Component",
      options: ["arrow-function", "function", "none"],
      disables: [
        { key: "componentName", isValue: "none" },
        { key: "exportComponent", isValue: "none" },
      ],
      value: store.config.component!,
    },
    componentName: {
      type: "input",
      name: "Component Name",
      disabled: store.config.component === "none",
      filter: /\s/g,
      value: store.config.componentName!,
    },
    preTagWrapTemplateLiterals: {
      type: "checkbox",
      name: "<pre> tag use template literals",
      value: store.config.preTagWrapTemplateLiterals!,
    },
    stripStyleTag: {
      type: "checkbox",
      name: "Remove <style> tags",
      value: store.config.stripStyleTag!,
    },
    stripComment: {
      type: "checkbox",
      name: "Remove comments",
      value: store.config.stripComment!,
    },
    indent: {
      type: "input",
      name: "indent characters",
      value: store.config.indent!,
      maskType: "character-count",
    },
    prefixSVGIds: {
      type: "input",
      name: "Prefix SVG IDs",
      placeholder: "SVG ID text...",
      value: store.config.prefixSVGIds!,
    },
    exportComponent: {
      type: "checkbox",
      name: "Export Component",
      disabled: store.config.component === "none",
      value: store.config.exportComponent!,
    },
  });

  const onClickResetAll = () => {
    localStorage.removeItem("config");
    setStore("config", defaultConfig);
  };

  createEffect(
    on(
      () => store.config[$TRACK as any as ConfigKey],
      () => {
        const config = store.config;

        try {
          localStorage.config = JSON.stringify(config);
        } catch (err) {}

        setConfigMap(
          produce((state) => {
            for (const key in configMap) {
              const value = config[key as ConfigKey];
              const stateItem = state[key as ConfigKey]!;

              if (stateItem.disables) {
                stateItem.disables.forEach((item) => {
                  state[item.key as ConfigKey]!.disabled =
                    item.isValue === value;
                });
              }

              stateItem.value = value as any;
            }
          })
        );
      },
      { defer: true }
    )
  );

  onMount(() => {
    try {
      const config = JSON.parse(localStorage.config) as TJSXConfig;
      if (typeof config !== "object") return;

      // race condition with hydration or solid-codemirror?
      requestAnimationFrame(() => {
        setStore("config", config);
      });
    } catch (err) {}
  });

  return (
    <div class="p-4 pt-0">
      <h2 class="opacity-50 font-bold pt-4 md:pt-2">JSX Config</h2>
      <ul>
        <For each={Object.entries(configMap)}>
          {([key, item]) => {
            const [isSelected, setIsSelected] = createSignal(false);
            const renderItem = () => {
              switch (item.type) {
                case "select":
                  return (
                    <Select
                      name={item.name}
                      options={item.options!}
                      selected={item.value as string}
                      disabled={item.disabled}
                      onOpen={(open) => setIsSelected(open)}
                      onChange={({ value }) => {
                        setStore(
                          produce((state) => {
                            state.config[key as ConfigKey] = value as any;
                          })
                        );
                      }}
                    />
                  );
                case "checkbox":
                  return (
                    <Toggle
                      name={item.name}
                      value={item.value as boolean}
                      disabled={item.disabled}
                      onChange={({ checked }) => {
                        setStore(
                          produce((state) => {
                            state.config[key as ConfigKey] = checked as any;
                          })
                        );
                      }}
                    />
                  );
                case "input": {
                  const trigger = debounce((value: string) => {
                    if (key === "componentName") {
                      if (!value) {
                        value = "SolidComponent";
                      }
                      value = value[0].toUpperCase() + value.slice(1);
                    }
                    setStore(
                      produce((state) => {
                        state.config[key as ConfigKey] = value as any;
                      })
                    );
                  }, 400);
                  return (
                    <Input
                      name={item.name}
                      value={item.value as string}
                      maskType={item.maskType!}
                      disabled={item.disabled}
                      filter={item.filter}
                      placeholder={item.placeholder}
                      onInput={(value) => {
                        trigger(value);
                      }}
                    />
                  );
                }
              }
            };
            return (
              <li
                class="py-10.75px border-b-2 dark:text-light border-#E5E5E5 dark:border-#3F3F3F text-13px lg:text-16px hover:bg-black/02 transition dark:hover:bg-white/02"
                classList={{
                  "!bg-black/05 dark:!bg-white/05": isSelected(),
                  "hover:!bg-transparent": item.disabled,
                }}
              >
                {renderItem()}
              </li>
            );
          }}
        </For>
      </ul>
      <button
        class="mt-4 px-20px py-6px rounded-8px border-1 border-black/50 hover:bg-black/10 text-#555 dark:(text-light border-white/50 hover:bg-white/10)"
        onClick={onClickResetAll}
      >
        Reset All
      </button>
    </div>
  );
};

export default ConfigPanel;
