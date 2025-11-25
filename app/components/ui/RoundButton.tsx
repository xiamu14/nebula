import { Button, ButtonProps } from "react-aria-components";

export default function RoundButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      className="pressed:bg-gray-200 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-gray-600 ring-violet-600/70 ring-offset-2 outline-hidden hover:bg-gray-100 focus-visible:ring-3"
    />
  );
}
