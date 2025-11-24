"use client";
import {
  Card,
  Checkbox,
  CheckboxGroup,
  Description,
  Label,
  Chip,
  Button,
  Modal,
  Tabs,
  Avatar,
  ListBox,
} from "@heroui/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Icon } from "@iconify/react";
import { CardStack } from "./components/ui/CardStack";
import { Highlight } from "./components/Highlight";
import DatePicker from "./components/ui/DatePicker";
import React from "react";

function Date() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Card className="gap-2 w-full h-[250px]">
      <img
        alt="Indie Hackers community"
        className="rounded-2xl w-full h-[65%] object-cover pointer-events-none select-none"
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
                      <div className="flex justify-center items-center pt-4">
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

function Weight() {
  const data = [
    { weight: 69, date: "11.11" },
    { weight: 69, date: "11.12" },
    { weight: 68, date: "11.13" },
    { weight: 68.8, date: "11.14" },
    { weight: 68, date: "11.15" },
  ];
  return (
    <Card className="w-full h-full">
      <Card.Header>
        <Card.Title>Weight</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="px-4 pt-2">
          <LineChart
            style={{
              width: "100%",
              maxWidth: "700px",
              height: "100%",
              maxHeight: "70vh",
              aspectRatio: 1.618,
            }}
            responsive
            data={data}
            margin={{
              top: 5,
              right: 0,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis width="auto" />
            <Tooltip />
            <Legend />

            <Line type="monotone" dataKey="weight" stroke="#82ca9d" />
          </LineChart>
        </div>
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

function Exercise() {
  return (
    <Card className="w-full h-full">
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

function CateringPlan() {
  return (
    <Card className="w-full h-full">
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

function Emotion() {
  return (
    <Card className="w-full h-full">
      <Card.Header>
        <Card.Title>Emotion</Card.Title>
      </Card.Header>
      <Card.Content className="flex flex-row justify-start items-start gap-2">
        <Chip color="success" variant="primary">
          <Icon icon="gravity-ui:circle-fill" width={6} />
          Joyful
        </Chip>
        <Chip color="warning" variant="primary">
          <Icon icon="gravity-ui:circle-fill" width={6} />
          Quiet
        </Chip>
      </Card.Content>
    </Card>
  );
}

function Notes() {
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
        <div className="flex pt-8 w-full h-[250px]">
          <CardStack items={CARDS} />
        </div>
      </Card.Content>
      <Card.Footer>
        <Button variant="ghost">New</Button>
      </Card.Footer>
    </Card>
  );
}

export default function BentoPage() {
  return (
    <div className="justify-center items-center bg-[#f5f5f5] py-10 w-screen h-screen overflow-y-auto">
      <div className="flex justify-center items-center">
        <div className="bg-base-200 m-auto w-[75%] lg:max-w-300 min-h-screen">
          <div className="p-5">
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <div className="gap-6 grid grid-cols-1 md:grid-cols-2 md:col-span-2 lg:row-span-3">
                <Date />
                <CateringPlan />
              </div>

              <div className="gap-6 grid grid-cols-1 md:grid-cols-2 md:col-span-2 lg:row-span-3">
                <Weight />
                <Exercise />
              </div>

              <div className="md:row-span-2 lg:row-span-3">
                <Emotion />
              </div>

              <div className="md:row-span-2 lg:row-span-3">
                <Notes />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
