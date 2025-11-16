export interface TodoItem {
  text: string;
  completed: boolean;
}

export interface ExerciseItem {
  name: string;
  duration: number;
  calorie: number;
  feel: string;
  completed: boolean;
}

export interface DailyRecord {
  date: string;
  meals: {
    breakfast: TodoItem[];
    lunch: TodoItem[];
    dinner: TodoItem[];
    drinks: TodoItem[];
    snacks: TodoItem[];
  };
  exercises: ExerciseItem[];
  notesRichText: string;
  mood: Record<string, number>;
}

export interface DayStructData {
  breakfastTotal: number;
  breakfastCompleted: number;
  lunchTotal: number;
  lunchCompleted: number;
  dinnerTotal: number;
  dinnerCompleted: number;
  drinksTotal: number;
  drinksCompleted: number;
  snacksTotal: number;
  snacksCompleted: number;
  exerciseTotal: number;
  exerciseCompleted: number;
  totalDuration: number;
  totalCalories: number;
  mood: Record<string, number>;
  enrichmentScore: number;
}
