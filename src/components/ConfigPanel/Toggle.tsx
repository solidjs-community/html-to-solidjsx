import { Component } from "solid-js";

const Toggle: Component<{
  name: string;
  value: boolean;
  disabled?: boolean;
  onChange: (props: { checked: boolean }) => void;
}> = (props) => {
  return (
    <label
      class="flex items-center justify-between gap-2"
      classList={{ "opacity-40 cursor-not-allowed": props.disabled }}
    >
      <span>{props.name}</span>
      <input
        class="switch"
        classList={{ "!cursor-not-allowed": props.disabled }}
        type="checkbox"
        role="switch"
        disabled={props.disabled}
        checked={props.value}
        onChange={(e) => props.onChange({ checked: e.currentTarget.checked })}
      />
    </label>
  );
};

export default Toggle;
