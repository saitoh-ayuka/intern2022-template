import { Box, Text } from "@chakra-ui/react";
import type { Holidays } from "./App";

type Props = {
  nowYear: number;
  nowMonth: number;
  oneday: number;

  holidayList: Holidays[];
};

export const ViewDays: React.FC<Props> = (props: Props) => {
  const today = new Date();

  const oneday = new Date(props.nowYear, props.nowMonth, props.oneday);

  let holiday = "";
  if (props.holidayList.length > 0)
    holiday = props.holidayList[0].date.slice(8);

  return (
    <Box>
      {/* 今日の日付＋緑四角 */}
      {props.oneday == today.getDate() &&
        today.getMonth() == props.nowMonth &&
        today.getFullYear() == props.nowYear && (
          <>
            <Box bg="green.300" px={1} h={1}></Box>
            <Text color="green.300">{props.oneday}日</Text>
          </>
        )}
      {/* 普通の土曜 */}
      {!(
        props.oneday == today.getDate() &&
        today.getMonth() == props.nowMonth &&
        today.getFullYear() == props.nowYear
      ) &&
        oneday.getDay() == 6 &&
        holiday == "" && (
          <>
            <Text color="#63B3ED">{props.oneday}日</Text>
          </>
        )}
      {/* 普通の日曜 */}
      {!(
        props.oneday == today.getDate() &&
        today.getMonth() == props.nowMonth &&
        today.getFullYear() == props.nowYear
      ) &&
        oneday.getDay() == 0 &&
        holiday == "" && (
          <>
            <Text color="tomato">{props.oneday}日</Text>
          </>
        )}
      {/* 普通の祝日 */}
      {holiday != "" && (
        <>
          <Text color="tomato">{props.oneday}日</Text>
        </>
      )}

      {/* 普通の日 */}
      {!(
        props.oneday == today.getDate() &&
        today.getMonth() == props.nowMonth &&
        today.getFullYear() == props.nowYear
      ) &&
        oneday.getDay() != 6 &&
        oneday.getDay() != 0 &&
        holiday == "" && (
          <>
            <Text>{props.oneday}日</Text>
          </>
        )}
    </Box>
  );
};
