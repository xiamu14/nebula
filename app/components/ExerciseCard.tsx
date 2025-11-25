import {
  Avatar,
  Button,
  Card,
  Description,
  Label,
  ListBox,
  Modal,
} from "@heroui/react";
import { Icon } from "@iconify/react";

export default function ExerciseCard() {
  return (
    <Card className="h-full w-full">
      <Card.Header>
        <Card.Title>Exercise</Card.Title>
      </Card.Header>
      <Card.Content>
        <ListBox aria-label="Users" className="w-[220px]" selectionMode="none">
          <ListBox.Item id="1" textValue="Bob">
            <Avatar size="sm">
              <Avatar.Image
                alt="Bob"
                src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
              />
              <Avatar.Fallback>B</Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col">
              <Label>Rope Skipping</Label>
              <Description>30 mins</Description>
            </div>
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item id="2" textValue="Fred">
            <Avatar size="sm">
              <Avatar.Image
                alt="Fred"
                src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg"
              />
              <Avatar.Fallback>F</Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col">
              <Label>Warm Up</Label>
              <Description>10 mins</Description>
            </div>
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item id="3" textValue="Martha">
            <Avatar size="sm">
              <Avatar.Image
                alt="Martha"
                src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg"
              />
              <Avatar.Fallback>M</Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col">
              <Label>HIIT</Label>
              <Description>30 mins</Description>
            </div>
            <ListBox.ItemIndicator />
          </ListBox.Item>
        </ListBox>
      </Card.Content>
      <Card.Footer>
        <Modal>
          <Button variant="ghost">Update</Button>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-[360px]">
              {({ close }) => (
                <>
                  <Modal.CloseTrigger />
                  <Modal.Header>
                    <Modal.Icon className="bg-default text-foreground">
                      <Icon className="size-5" icon="gravity-ui:rocket" />
                    </Modal.Icon>
                    <Modal.Heading>Welcome to HeroUI</Modal.Heading>
                  </Modal.Header>
                  <Modal.Body>
                    <p>
                      A beautiful, fast, and modern React UI library for
                      building accessible and customizable web applications with
                      ease.
                    </p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button className="w-full" onPress={close}>
                      Continue
                    </Button>
                  </Modal.Footer>
                </>
              )}
            </Modal.Dialog>
          </Modal.Container>
        </Modal>
      </Card.Footer>
    </Card>
  );
}
