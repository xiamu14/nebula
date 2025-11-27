"use client";
import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import {
  Avatar,
  Button,
  Card,
  Description,
  Form,
  InputGroup,
  Label,
  ListBox,
  Modal,
  TextField,
} from "@heroui/react";
import { currentDateState } from "@/app/store/global.state";
import { useExerciseData, saveExerciseRecord, Exercise } from "@/app/hooks/useExerciseData";
import { formatDate } from "@/app/utils/dateUtils";
import { isValidDuration, formatDuration } from "@/app/utils/exerciseUtils";
import { Icon } from "@iconify/react";

// 根据运动名称获取头像颜色
function getAvatarColor(name: string): string {
  const colors = {
    "Rope Skipping": "blue",
    "warm up": "green",
    "hiit": "purple",
  };
  return colors[name as keyof typeof colors] || "default";
}

// 根据运动名称获取首字母
function getInitials(name: string): string {
  return name.charAt(0).toUpperCase();
}

export default function ExerciseCard() {
  const currentDate = useSnapshot(currentDateState);
  const [inputValues, setInputValues] = useState<{ [exerciseId: number]: string }>({});
  const [errorMessages, setErrorMessages] = useState<{ [exerciseId: number]: string }>({});

  // 加载运动数据
  const { data, isLoading, error, setData } = useExerciseData(
    currentDate.day.toDate().toISOString(),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 当日期改变或数据加载完成时，初始化输入值
  useEffect(() => {
    if (data.exercises.length > 0) {
      const initialValues: { [exerciseId: number]: string } = {};
      data.exercises.forEach((exercise) => {
        initialValues[exercise.id] = String(data.durations[exercise.id] || 0);
      });
      setInputValues(initialValues);
    }
  }, [data.exercises, data.durations]);

  const handleInputChange = (exerciseId: number, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [exerciseId]: value,
    }));

    // 清除对应的错误信息
    if (errorMessages[exerciseId]) {
      setErrorMessages((prev) => {
        const newErrors = { ...prev };
        delete newErrors[exerciseId];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (close: () => void) => {
    setErrorMessages({});
    setIsSubmitting(true);

    try {
      // 验证所有输入
      const newErrors: { [exerciseId: number]: string } = {};
      Object.entries(inputValues).forEach(([exerciseId, value]) => {
        if (!isValidDuration(value)) {
          newErrors[parseInt(exerciseId, 10)] =
            "Please enter a valid duration (0-1440 minutes)";
        }
      });

      if (Object.keys(newErrors).length > 0) {
        setErrorMessages(newErrors);
        setIsSubmitting(false);
        return;
      }

      // 保存所有运动记录
      const date = currentDate.day.toDate();
      const promises = Object.entries(inputValues).map(([exerciseId, value]) =>
        saveExerciseRecord(parseInt(exerciseId, 10), date, parseInt(value, 10)),
      );

      await Promise.all(promises);

      // 乐观更新本地数据
      const newDurations: { [exerciseId: number]: number } = {};
      Object.entries(inputValues).forEach(([exerciseId, value]) => {
        newDurations[parseInt(exerciseId, 10)] = parseInt(value, 10);
      });

      setData({
        ...data,
        durations: newDurations,
        records: Object.entries(newDurations).map(([exerciseId, duration]) => ({
          id: 0,
          exerciseId: parseInt(exerciseId, 10),
          date: date.toISOString(),
          duration,
          exercise: data.exercises.find((e) => e.id === parseInt(exerciseId, 10)),
        })),
      });

      close();
    } catch (error) {
      console.error("Failed to save exercise records:", error);
      setErrorMessages({
        0: "Failed to save exercise records. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderExerciseItem = (exercise: Exercise) => {
    const duration = data.durations[exercise.id] || 0;

    return (
      <ListBox.Item key={exercise.id} id={exercise.id.toString()} textValue={exercise.name}>
        <Avatar size="sm">
          <Avatar.Image
            alt={exercise.name}
            src={`https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/${getAvatarColor(
              exercise.name,
            )}.jpg`}
          />
          <Avatar.Fallback>{getInitials(exercise.name)}</Avatar.Fallback>
        </Avatar>
        <div className="flex flex-col">
          <Label>{exercise.name}</Label>
          <Description>{formatDuration(duration)}</Description>
        </div>
        <ListBox.ItemIndicator />
      </ListBox.Item>
    );
  };

  if (error) {
    return (
      <Card className="h-full w-full">
        <Card.Header>
          <Card.Title>Exercise</Card.Title>
        </Card.Header>
        <Card.Content>
          <Description className="text-red-500">Error loading exercise data: {error}</Description>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card className="h-full w-full">
      <Card.Header>
        <Card.Title>Exercise</Card.Title>
      </Card.Header>
      <Card.Content>
        {isLoading ? (
          <Description>Loading...</Description>
        ) : (
          <ListBox aria-label="Exercises" className="w-[220px]" selectionMode="none">
            {data.exercises.map(renderExerciseItem)}
          </ListBox>
        )}
      </Card.Content>
      <Card.Footer>
        <Modal
          onOpenChange={(isOpen) => {
            if (isOpen) {
              // Modal 打开时，如果当前日期有记录则预填充
              // inputValues 已在 useEffect 中初始化
            } else {
              // Modal 关闭时，清空错误信息
              setErrorMessages({});
            }
          }}
        >
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
                    <Modal.Heading>Update Exercise Duration</Modal.Heading>
                  </Modal.Header>
                  <Modal.Body>
                    <Description className="mb-4">
                      {formatDate(currentDate.day.toDate())}
                    </Description>
                    <Form>
                      {data.exercises.map((exercise) => (
                        <div key={exercise.id} className="mt-4">
                          <TextField className="w-full max-w-[280px]">
                            <InputGroup>
                              <InputGroup.Prefix>
                                {exercise.name}
                              </InputGroup.Prefix>
                              <InputGroup.Input
                                type="number"
                                min="0"
                                max="1440"
                                value={inputValues[exercise.id] || ""}
                                onChange={(e) =>
                                  handleInputChange(exercise.id, e.target.value)
                                }
                                placeholder="0"
                                disabled={isSubmitting}
                              />
                              <InputGroup.Suffix>mins</InputGroup.Suffix>
                            </InputGroup>
                            {errorMessages[exercise.id] && (
                              <Description className="text-red-500 mt-1">
                                {errorMessages[exercise.id]}
                              </Description>
                            )}
                          </TextField>
                        </div>
                      ))}
                      {errorMessages[0] && (
                        <Description className="text-red-500 mt-4">
                          {errorMessages[0]}
                        </Description>
                      )}
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      type="submit"
                      onClick={() => handleSubmit(close)}
                      className="w-full"
                      isDisabled={isSubmitting || isLoading}
                    >
                      {isSubmitting ? "Saving..." : "Save"}
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
