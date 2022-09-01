import { Tr, Td, Tbody } from "@chakra-ui/react";
import { Oneday } from "./Oneday";
import type { Schedule } from "./App";

type Props = {
  nowYear: number;
  nowMonth: number;
  scheduleList: Schedule[];
  addSchedule: (Schedule: Schedule) => void;
};

export const MakeMonth: React.FC<Props> = (props: Props) => {
  const make_calendar = (year: number, month: number) => {
    // 年とか月とか計算します n年n月１日の情報を持ってくる
    const monthFirst = new Date(year, month, 1);

    // カレンダーに入れる値の初期化
    const month_days: (number | undefined)[][] = [];

    // カレンダーに値を入れる
    const month_endday = new Date(
      monthFirst.getFullYear(),
      monthFirst.getMonth() + 1,
      0
    );
    let dayCount = 1;
    for (let i = 0; i < 6; i++) {
      // １週間単位で日付を入れていく
      const weekdays: (number | undefined)[] = [];

      for (let j = 0; j < 7; j++) {
        // 初週かつ、まだ月初めではない  ||  もう月末過ぎた
        if (
          (i == 0 && monthFirst.getDay() > j) ||
          dayCount > month_endday.getDate()
        )
          weekdays[j] = undefined;
        else {
          weekdays[j] = dayCount;
          dayCount++;
        }
      }
      month_days[i] = weekdays;
    }
    return month_days;
  };

  // カレンダー作る
  const month_days = make_calendar(props.nowYear, props.nowMonth);

  // リスト状にして出す
  return (
    <Tbody>
      {month_days.map((weekdays, index) => (
        <Tr key={index}>
          {weekdays.map((oneday, index) => {
            if (oneday == null) {
              return <Td key={index} padding={0} border="1px solid black"></Td>;
            } else {
              return (
                <Td
                  key={index}
                  padding={0}
                  border="1px solid black"
                  h="110px"
                  w="150px"
                  verticalAlign="top"
                >
                  <Oneday
                    nowYear={props.nowYear}
                    nowMonth={props.nowMonth}
                    oneday={oneday}
                    addSchedule={props.addSchedule}
                    scheduleList={props.scheduleList.filter((value) => {
                      const month = (
                        "00" + (props.nowMonth + 1).toString()
                      ).slice(-2);
                      const date = ("00" + oneday.toString()).slice(-2);
                      return (
                        value.date ===
                        props.nowYear.toString() + "-" + month + "-" + date
                      );
                    })}
                  />
                </Td>
              );
            }
          })}
        </Tr>
      ))}
    </Tbody>
  );
};
