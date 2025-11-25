import { Avatar, Card, Modal } from "@heroui/react";
import React from "react";
import DatePicker from "./ui/DatePicker";

export default function DateCard() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Card className="h-[250px] w-full gap-2">
      <img
        alt="Indie Hackers community"
        className="pointer-events-none h-[65%] w-full rounded-2xl object-cover select-none"
        loading="lazy"
        src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/demo1.jpg"
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
              11.24
            </p>
            <Modal.Container>
              <Modal.Dialog className="sm:max-w-[360px]">
                {({ close }) => (
                  <>
                    <Modal.CloseTrigger />
                    <Modal.Body>
                      <div className="flex items-center justify-center pt-4">
                        <DatePicker />
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
