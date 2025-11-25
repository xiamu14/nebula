import { Button, Card, Modal } from "@heroui/react";
import { Icon } from "@iconify/react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function WeightCard() {
  const data = [
    { weight: 69, date: "11.11" },
    { weight: 69, date: "11.12" },
    { weight: 68, date: "11.13" },
    { weight: 68.8, date: "11.14" },
    { weight: 68, date: "11.15" },
  ];
  return (
    <Card className="h-full w-full">
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
