const XIcon = (props: any) => {
  return (
    <svg
      fill="none"
      stroke-width="2"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      viewBox="0 0 24 24"
      height={props.size || "1em"}
      width={props.size || "1em"}
      style="overflow: visible;"
      ref={props.ref}
    >
      <path d="M18 6 6 18M6 6l12 12"></path>
    </svg>
  );
};

export default XIcon;
