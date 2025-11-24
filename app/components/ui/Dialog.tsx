import { Dialog, DialogPanel } from "@headlessui/react";
import { MutableRefObject, useImperativeHandle, useState } from "react";
import { Button } from "@/components/base/buttons/button";

export type controlRef = {
  open: () => void;
  close: () => void;
};

export default function MyDialog(props: {
  controlRef: MutableRefObject<controlRef | null>;
}) {
  let [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  useImperativeHandle(props.controlRef, () => {
    return {
      open,
      close,
    };
  });

  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="z-10 relative focus:outline-none"
        onClose={close}
        __demoMode
      >
        <div className="z-10 fixed inset-0 w-screen overflow-y-auto">
          <div className="flex justify-center items-center p-4 min-h-full">
            <DialogPanel
              transition
              className="bg-white data-closed:opacity-0 shadow-md backdrop-blur-2xl p-6 border border-gray-200 rounded-xl w-full max-w-md data-closed:transform-[scale(95%)] duration-300 ease-out"
            >
              <div className="flex flex-row justify-end items-center">
                <Button color="primary" size="md">
                  保存
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
