import { useEffect } from "react";
import dayjs from "dayjs";
import { currentDateState } from "../store/global.state";

export function useAutoUpdateDate() {
  useEffect(() => {
    // 页面首次加载时更新日期
    currentDateState.day = dayjs();

    // 监听页面焦点事件，当用户切换回该 tab 时更新日期
    const handleFocus = () => {
      currentDateState.day = dayjs();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);
}
