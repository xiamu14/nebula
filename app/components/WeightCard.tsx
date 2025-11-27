"use client";
import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import {
  Button,
  Card,
  Description,
  Form,
  InputGroup,
  Modal,
  TextField,
} from "@heroui/react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { currentDateState } from "@/app/store/global.state";
import { useWeightChartData, saveWeight } from "@/app/hooks/useWeightData";
import { formatDate } from "@/app/utils/dateUtils";
import { isValidWeight } from "@/app/utils/weightUtils";
import { sortChartData } from "@/app/utils/dateComparator";

// 根据当前日期查找权重值
function findWeightByCurrentDate(
  data: { date: string; weight: number }[],
  currentDate: Date,
): string {
  const formattedDate = formatDate(currentDate);
  const record = data.find((d) => d.date === formattedDate);
  return record ? String(record.weight) : "";
}

export default function WeightCard() {
  const currentDate = useSnapshot(currentDateState);
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // 加载图表数据 (本地状态)
  const { data, isLoading, error: loadError, setData } = useWeightChartData(7);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (close: () => void) => {
    setErrorMessage("");

    if (!inputValue) {
      setErrorMessage("Please enter a weight value");
      return;
    }

    if (!isValidWeight(inputValue)) {
      setErrorMessage("Please enter a valid weight between 0 and 300 kg");
      return;
    }

    try {
      setIsSubmitting(true);
      const date = currentDate.day.toDate();
      await saveWeight(date, parseFloat(inputValue));

      // 乐观刷新：立即更新本地数据
      const formattedDate = formatDate(date);
      const formattedValue = parseFloat(inputValue);

      // 更新或添加数据点（创建新数组，避免直接修改）
      const existingIndex = data.findIndex((d) => d.date === formattedDate);
      let updatedData: { date: string; weight: number }[];

      if (existingIndex >= 0) {
        updatedData = data.map((item, index) =>
          index === existingIndex ? { ...item, weight: formattedValue } : item,
        );
      } else {
        updatedData = [
          ...data,
          { date: formattedDate, weight: formattedValue },
        ];
      }

      // 重新排序数据
      setData(sortChartData(updatedData));

      setInputValue("");
      close();
    } catch (error) {
      console.log(error);

      setErrorMessage(
        (error instanceof Error ? error.message : String(error)) ||
          "Failed to save weight",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <YAxis width="auto" domain={[60, 80]} />
            <Tooltip />
            <Legend />
            <ReferenceLine
              y={66}
              label="Target"
              stroke="#fa7e5e"
              strokeDasharray="3 3"
            />

            <Line type="monotone" dataKey="weight" stroke="#17c964" />
          </LineChart>
        </div>
      </Card.Content>
      <Card.Footer>
        <Modal
          onOpenChange={(isOpen) => {
            if (isOpen) {
              // Modal 打开时，如果当前日期有记录则预填充
              const weight = findWeightByCurrentDate(
                data,
                currentDate.day.toDate(),
              );
              setInputValue(weight);
            } else {
              // Modal 关闭时，清空输入框和错误信息
              setInputValue("");
              setErrorMessage("");
            }
          }}
        >
          <Button variant="ghost">Update</Button>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-[360px]">
              {({ close }) => (
                <>
                  <Modal.CloseTrigger />
                  <Modal.Header>Update Weight</Modal.Header>
                  <Modal.Body>
                    <Form>
                      <TextField className="mt-2">
                        <TextField className="w-full max-w-[280px]">
                          <InputGroup>
                            <InputGroup.Prefix>
                              {formatDate(currentDate.day.toDate())}
                            </InputGroup.Prefix>
                            <InputGroup.Input
                              className="w-full max-w-[200px]"
                              type="number"
                              step="0.1"
                              value={inputValue}
                              onChange={(e) => {
                                setInputValue(e.target.value);
                                setErrorMessage("");
                              }}
                              placeholder="Enter weight"
                              disabled={isSubmitting}
                            />
                            <InputGroup.Suffix>kg</InputGroup.Suffix>
                          </InputGroup>
                          {errorMessage && (
                            <Description className="text-red-500">
                              {errorMessage}
                            </Description>
                          )}
                        </TextField>
                      </TextField>
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
