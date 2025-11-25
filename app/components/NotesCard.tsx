import { Button, Card, Modal, TextArea } from "@heroui/react";
import { CardStack } from "./ui/CardStack";
import { Highlight } from "./Highlight";

export default function NotesCard() {
  const CARDS = [
    {
      id: 0,
      name: "Manu Arora",
      designation: "Senior Software Engineer",
      content: (
        <p>
          These cards are amazing, <Highlight>I want to use them</Highlight> in
          my project. Framer motion is a godsend ngl tbh fam 🙏
        </p>
      ),
    },
    {
      id: 1,
      name: "Elon Musk",
      designation: "Senior Shitposter",
      content: (
        <p>
          I dont like this Twitter thing,{" "}
          <Highlight>deleting it right away</Highlight> because yolo. Instead, I
          would like to call it <Highlight>X.com</Highlight> so that it can
          easily be confused with adult sites.
        </p>
      ),
    },
    {
      id: 2,
      name: "Tyler Durden",
      designation: "Manager Project Mayhem",
      content: (
        <p>
          The first rule of
          <Highlight>Fight Club</Highlight> is that you do not talk about fight
          club. The second rule of
          <Highlight>Fight club</Highlight> is that you DO NOT TALK about fight
          club.
        </p>
      ),
    },
  ];
  return (
    <Card>
      <Card.Header>
        <Card.Title>Notes</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="flex h-[250px] w-full pt-8">
          <CardStack items={CARDS} />
        </div>
      </Card.Content>
      <Card.Footer>
        <Modal>
          <Button variant="ghost">Update</Button>
          <Modal.Container>
            <Modal.Dialog className="w-[400px] sm:max-w-[360px]">
              {({ close }) => (
                <>
                  <Modal.CloseTrigger />
                  <Modal.Header>
                    <Modal.Icon className="bg-default text-foreground">
                      <img
                        className="h-full w-full rounded-full"
                        src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
                      />
                    </Modal.Icon>
                    <Modal.Heading>Update Notes</Modal.Heading>
                  </Modal.Header>
                  <Modal.Body>
                    <TextArea
                      aria-label="The present harvest"
                      className="h-[300px] w-full"
                      placeholder="Share a harvest..."
                    />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button className="w-full" onPress={close}>
                      Save
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
