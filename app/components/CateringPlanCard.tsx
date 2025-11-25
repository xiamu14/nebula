import {
  Button,
  Card,
  Checkbox,
  CheckboxGroup,
  Description,
  Label,
  Modal,
  Tabs,
} from "@heroui/react";
import { Icon } from "@iconify/react";

export default function CateringPlanCard() {
  return (
    <Card className="h-full w-full">
      <Card.Header>
        <Card.Title>Catering Plan</Card.Title>
      </Card.Header>
      <Card.Content className="flex flex-row justify-around">
        <Tabs className="w-full max-w-md">
          <Tabs.ListContainer>
            <Tabs.List aria-label="Options">
              <Tabs.Tab id="overview">
                Breakfast
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="analytics">
                Lunch
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="reports">
                Fruit
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
          <Tabs.Panel className="pt-4" id="overview">
            <CheckboxGroup name="breakfast">
              <Checkbox value="milk">
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Content>
                  <Label>milk</Label>
                  <Description>300k</Description>
                </Checkbox.Content>
              </Checkbox>
              <Checkbox value="baozi">
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Content>
                  <Label>baozi</Label>
                  <Description>100k</Description>
                </Checkbox.Content>
              </Checkbox>
            </CheckboxGroup>
          </Tabs.Panel>
          <Tabs.Panel className="pt-4" id="analytics">
            <CheckboxGroup name="breakfast">
              <Checkbox value="milk">
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Content>
                  <Label>milk</Label>
                  <Description>300k</Description>
                </Checkbox.Content>
              </Checkbox>
              <Checkbox value="baozi">
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Content>
                  <Label>baozi</Label>
                  <Description>100k</Description>
                </Checkbox.Content>
              </Checkbox>
            </CheckboxGroup>
          </Tabs.Panel>
          <Tabs.Panel className="pt-4" id="reports">
            <CheckboxGroup name="breakfast">
              <Checkbox value="milk">
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Content>
                  <Label>milk</Label>
                  <Description>300k</Description>
                </Checkbox.Content>
              </Checkbox>
              <Checkbox value="baozi">
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Content>
                  <Label>baozi</Label>
                  <Description>100k</Description>
                </Checkbox.Content>
              </Checkbox>
            </CheckboxGroup>
          </Tabs.Panel>
        </Tabs>
      </Card.Content>
      <Card.Footer>
        <Modal>
          <Button variant="ghost">New</Button>
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
