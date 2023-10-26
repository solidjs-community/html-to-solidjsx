const ArrowLeftIcon = (props: any) => {
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
      <path d="M19 12H5M12 19l-7-7 7-7"></path>
    </svg>
  );
};

export default ArrowLeftIcon;
