import { Card, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function EmotionCard() {
  return (
    <Card className="h-full w-full">
      <Card.Header>
        <Card.Title>Emotion</Card.Title>
      </Card.Header>
      <Card.Content className="flex flex-row items-start justify-start gap-2">
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
