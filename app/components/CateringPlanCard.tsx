import React from "react";
import {
  Button,
  Card,
  Checkbox,
  CheckboxGroup,
  CloseButton,
  Description,
  FieldError,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  InputGroup,
  Label,
  Modal,
  Tabs,
  TextField,
} from "@heroui/react";
import { Icon } from "@iconify/react";

export default function CateringPlanCard() {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

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
            <CheckboxGroup name="Launch">
              <Checkbox
                value="milk"
                onMouseEnter={() => setHoveredIndex(0)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Content>
                  <Label>milk</Label>
                  <Description>300k</Description>
                </Checkbox.Content>
                <div className="flex-1"></div>
                {hoveredIndex === 0 && <CloseButton />}
              </Checkbox>
              <Checkbox
                value="baozi"
                onMouseEnter={() => setHoveredIndex(1)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Content>
                  <Label>baozi</Label>
                  <Description>100k</Description>
                </Checkbox.Content>
                <div className="flex-1"></div>
                {hoveredIndex === 1 && <CloseButton />}
              </Checkbox>
            </CheckboxGroup>
          </Tabs.Panel>
          <Tabs.Panel className="pt-4" id="reports">
            <CheckboxGroup name="Fruit">
              <Checkbox value="Orange">
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Content>
                  <Label>Orange</Label>
                  <Description>300g</Description>
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
          <Modal.Container className="w-[500px]">
            <Modal.Dialog className="sm:max-w-[360px]">
              {({ close }) => (
                <>
                  <Modal.CloseTrigger />

                  <Modal.Body>
                    <Form className="w-full max-w-96" onSubmit={() => {}}>
                      <Fieldset>
                        <Fieldset.Legend className="mb-4">
                          Update Diet{" "}
                        </Fieldset.Legend>

                        <FieldGroup>
                          <TextField id="plan-name">
                            <Label>Food</Label>
                            <Input placeholder="e.g. Milk" />
                            <FieldError />
                          </TextField>
                          <TextField>
                            <Label>Weight</Label>
                            <InputGroup>
                              <InputGroup.Input
                                className="w-full max-w-[280px]"
                                defaultValue="100"
                                type="number"
                              />
                              <InputGroup.Suffix>g</InputGroup.Suffix>
                            </InputGroup>
                          </TextField>
                        </FieldGroup>
                        <Fieldset.Actions className="justify-end">
                          <Button
                            type="reset"
                            variant="secondary"
                            onClick={close}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">
                            <Icon icon="gravity-ui:floppy-disk" />
                            Save
                          </Button>
                        </Fieldset.Actions>
                      </Fieldset>
                    </Form>
                  </Modal.Body>
                </>
              )}
            </Modal.Dialog>
          </Modal.Container>
        </Modal>
      </Card.Footer>
    </Card>
  );
}
