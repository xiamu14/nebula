import { Avatar, Card, Modal } from "@heroui/react";
import React from "react";
import DatePicker from "./ui/DatePicker";
import { useSnapshot } from "valtio";
import { currentDateState } from "../store/global.state";

export default function DateCard() {
  const [isOpen, setIsOpen] = React.useState(false);

  const currentDateSnapshot = useSnapshot(currentDateState);

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Card className="h-[250px] w-full gap-2">
      <img
        alt="Indie Hackers community"
        className="pointer-events-none h-[65%] w-full rounded-2xl object-cover select-none"
        loading="lazy"
        src="https://images.unsplash.com/photo-1761839262867-af53d08b0eb5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
      <Card.Header>
        <Card.Title>
          <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
            <p
              className="cursor-pointer"
              onClick={() => {
                setIsOpen(true);
              }}
            >
              {currentDateSnapshot.day.format("MM.DD")}
            </p>
            <Modal.Container className="h-[380px] w-[420px]">
              <Modal.Dialog className="scrollbar-hide h-full sm:max-w-[360px]">
                {({ close }) => (
                  <>
                    <Modal.CloseTrigger />
                    <Modal.Body>
                      <div className="scrollbar-hide flex items-center justify-center pt-4">
                        <DatePicker onSelected={onClose} />
                      </div>
                    </Modal.Body>
                  </>
                )}
              </Modal.Dialog>
            </Modal.Container>
          </Modal>
        </Card.Title>
        <Card.Description>天气晴</Card.Description>
      </Card.Header>
      <Card.Footer className="flex gap-2">
        <Avatar aria-label="Martha's profile picture" className="size-5">
          <Avatar.Image
            alt="Martha's avatar"
            src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg"
          />
          <Avatar.Fallback className="text-xs">IH</Avatar.Fallback>
        </Avatar>
        <span className="text-xs">心情佳</span>
      </Card.Footer>
    </Card>
  );
}
