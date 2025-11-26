"use client";
import React, { useState, useMemo } from "react";
import { useSnapshot } from "valtio";
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
  ListBox,
  Modal,
  Select,
  Tabs,
  TextField,
} from "@heroui/react";
import {
  DietPlan,
  getCategoryLabel,
  getCategoryFromTabId,
  getCategoryTabId,
  validateDietPlanForm,
  DietCategory,
  TabKey,
} from "@/app/utils/dietPlanUtils";
import {
  useDietPlanData,
  createDietPlan,
  updateDietPlanStatus,
  deleteDietPlan,
} from "@/app/hooks/useDietPlanData";
import type { Key } from "react-aria-components";
import { currentDateState } from "../store/global.state";

export default function CateringPlanCard() {
  const currentDate = useSnapshot(currentDateState).day;
  const [activeTab, setActiveTab] = useState<TabKey>("breakfastPlans");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [newItemAmount, setNewItemAmount] = useState("100");
  const [newItemUnit, setNewItemUnit] = useState<Key | null>("g");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 缓存当前日期以避免无限渲染
  const currentDateForQuery = useMemo(
    () => currentDateState.day.toDate(),
    [currentDateState.day],
  );

  // 获取所有分类的饮食计划数据
  const { data: allPlans, refetch } = useDietPlanData(currentDateForQuery);

  // 按分类过滤数据
  const getPlansByCategory = (category: DietCategory): DietPlan[] => {
    return allPlans.filter((plan) => plan.category === category);
  };

  const breakfastPlans = getPlansByCategory("BREAKFAST");
  const lunchPlans = getPlansByCategory("LUNCH");
  const fruitPlans = getPlansByCategory("FRUIT");
  const dinnerPlans = getPlansByCategory("DINNER");

  const handleSubmit = async (close: () => void) => {
    setErrorMessage("");

    const category = getCategoryFromTabId(activeTab);
    if (!category) {
      setErrorMessage("Invalid category");
      return;
    }

    const data = {
      name: newItemName,
      amount: parseFloat(newItemAmount),
      unit: newItemUnit as string,
      category,
    };

    const errors = validateDietPlanForm(data);

    if (errors.length > 0) {
      console.log(
        "%c data",
        "background: #69c0ff; color: white; padding: 4px",
        data,
      );
      setErrorMessage(errors[0]);
      return;
    }

    try {
      setIsSubmitting(true);

      await createDietPlan(
        {
          name: newItemName,
          amount: parseFloat(newItemAmount),
          unit: newItemUnit as string,
          category,
        },
        currentDate.toDate(),
      );

      // 重新加载数据
      await refetch();

      // 重置表单
      setNewItemName("");
      setNewItemAmount("100");
      setNewItemUnit("g");
      close();
    } catch (error) {
      console.error("Error creating diet plan:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create diet plan",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (plan: DietPlan, checked: boolean) => {
    try {
      const newStatus = checked ? "DONE" : "PENDING";
      await updateDietPlanStatus(plan.id, newStatus);

      // 乐观更新本地数据
      await refetch();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (plan: DietPlan) => {
    try {
      await deleteDietPlan(plan.id);

      // 乐观更新本地数据
      await refetch();
    } catch (error) {
      console.error("Error deleting diet plan:", error);
    }
  };

  const renderCheckboxGroup = (plans: DietPlan[]) => {
    if (plans.length === 0) {
      return (
        <div className="py-4 text-center text-gray-500">
          Empty. Click "New" to add.
        </div>
      );
    }

    return (
      <CheckboxGroup name={activeTab}>
        {plans.map((plan, index) => (
          <Checkbox
            key={plan.id}
            value={String(plan.id)}
            isSelected={plan.status === "DONE"}
            onChange={(isChecked: boolean) => {
              handleStatusChange(plan, isChecked);
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Content>
              <Label>{plan.name}</Label>
              <Description>
                {plan.amount}
                {plan.unit}
              </Description>
            </Checkbox.Content>
            <div className="flex-1"></div>
            {hoveredIndex === index && (
              <CloseButton
                onClick={() => handleDelete(plan)}
                aria-label="Delete item"
              />
            )}
          </Checkbox>
        ))}
      </CheckboxGroup>
    );
  };

  return (
    <Card className="h-full w-full">
      <Card.Header>
        <Card.Title>Catering Plan</Card.Title>
      </Card.Header>
      <Card.Content className="flex flex-row justify-around">
        <Tabs
          className="w-full max-w-md"
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(String(key) as TabKey)}
        >
          <Tabs.ListContainer>
            <Tabs.List aria-label="Options">
              <Tabs.Tab id="breakfastPlans" key="breakfastPlans">
                {getCategoryLabel("BREAKFAST")}
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="lunchPlans" key="lunchPlans">
                {getCategoryLabel("LUNCH")}
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="dinnerPlans" key="dinnerPlans">
                {getCategoryLabel("DINNER")}
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="fruitPlans" key="fruitPlans">
                {getCategoryLabel("FRUIT")}
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
          <Tabs.Panel className="pt-4" id="breakfastPlans" key="breakfastPlans">
            {renderCheckboxGroup(breakfastPlans)}
          </Tabs.Panel>
          <Tabs.Panel className="pt-4" id="lunchPlans" key="lunchPlans">
            {renderCheckboxGroup(lunchPlans)}
          </Tabs.Panel>
          <Tabs.Panel className="pt-4" id="dinnerPlans" key="dinnerPlans">
            {renderCheckboxGroup(dinnerPlans)}
          </Tabs.Panel>
          <Tabs.Panel className="pt-4" id="fruitPlans" key="fruitPlans">
            {renderCheckboxGroup(fruitPlans)}
          </Tabs.Panel>
        </Tabs>
      </Card.Content>
      <Card.Footer>
        <Modal
          onOpenChange={(isOpen) => {
            if (isOpen) {
              setErrorMessage("");
              setNewItemName("");
              setNewItemAmount("100");
              setNewItemUnit("g");
            }
          }}
        >
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
                          New Diet -{" "}
                          {getCategoryLabel(
                            getCategoryFromTabId(activeTab) || "BREAKFAST",
                          )}
                        </Fieldset.Legend>

                        <FieldGroup>
                          <TextField
                            id="plan-name"
                            value={newItemName}
                            onChange={(value: string) => {
                              setNewItemName(value);
                              setErrorMessage("");
                            }}
                          >
                            <Label>Food</Label>
                            <Input placeholder="e.g. Milk" />
                            <FieldError />
                          </TextField>
                          <TextField>
                            <Label>Deal</Label>
                            <div className="flex w-full items-center justify-start gap-2">
                              <Input
                                className="flex-1"
                                value={newItemAmount}
                                onChange={(
                                  event: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                  setNewItemAmount(event.target.value);
                                  setErrorMessage("");
                                }}
                                type="number"
                              />
                              <Select
                                className="w-[120px]"
                                value={newItemUnit}
                                placeholder="Select Unit"
                                onChange={(value) => {
                                  setNewItemUnit(value);
                                }}
                              >
                                <Select.Trigger>
                                  <Select.Value />
                                  <Select.Indicator />
                                </Select.Trigger>
                                <Select.Popover>
                                  <ListBox>
                                    <ListBox.Item key="g" id="g" textValue="g">
                                      g
                                      <ListBox.ItemIndicator />
                                    </ListBox.Item>
                                    <ListBox.Item
                                      key="ml"
                                      id="ml"
                                      textValue="ml"
                                    >
                                      ml
                                      <ListBox.ItemIndicator />
                                    </ListBox.Item>
                                  </ListBox>
                                </Select.Popover>
                              </Select>
                            </div>
                          </TextField>
                          {errorMessage && (
                            <Description className="text-red-500">
                              {errorMessage}
                            </Description>
                          )}
                        </FieldGroup>
                        <Fieldset.Actions className="justify-end">
                          <Button
                            type="reset"
                            variant="secondary"
                            onClick={close}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="w-20"
                            onClick={() => handleSubmit(close)}
                            isDisabled={isSubmitting}
                          >
                            {isSubmitting ? "Saving..." : "Save"}
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
