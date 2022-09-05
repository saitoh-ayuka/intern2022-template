import { useEffect, useState } from "react";
import { Center } from "@chakra-ui/react";
import { Table, Thead, Tr, Th, TableContainer } from "@chakra-ui/react";
import { Spacer, HStack, Box, Text } from "@chakra-ui/react";
import { IconContext } from "react-icons";
import { GoCalendar } from "react-icons/go";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import type React from "react";
import { MakeMonth } from "./MakeMonth";

export type Schedule = {
  title: string;
  date: string;
  beforeTime: string | null;
  afterTime: string | null;
  memo: string | null;
  allday: boolean;
  id: number;
};

export type Holidays = {
  title: string;
  date: string;
};

const App: React.FC = () => {
  const today = new Date();

  const [nowMonth, setNowMonth] = useState<number>(today.getMonth());
  const [nowYear, setNowYear] = useState<number>(today.getFullYear());

  const handleChevronLeftClick = () => {
    // ()の中身通りに変数を変更する
    if (nowMonth >= 1) setNowMonth((nowMonth) => nowMonth - 1);
    else if (nowMonth < 1) {
      // 去年の１２月へ行く
      setNowMonth((nowMonth) => nowMonth + 11);
      setNowYear((nowYear) => nowYear - 1);
    }
  };

  const handleChevronRightClick = () => {
    // ()の中身通りに変数を変更する
    if (nowMonth < 11) setNowMonth((nowMonth) => nowMonth + 1);
    else if (nowMonth >= 11) {
      // 来年の１月へ行く
      setNowMonth((nowMonth) => nowMonth - 11);
      setNowYear((nowYear) => nowYear + 1);
    }
  };

  const [scheduleList, setScheduleList] = useState<Schedule[]>([]);

  const addSchedule = (newSchedule: Schedule) => {
    //既存のscheduleList + 追加したい予定
    setScheduleList((prevList: Schedule[]) => {
      const tempScheduleList = [...prevList];
      tempScheduleList.push(newSchedule);
      return tempScheduleList;

      // return [...prevList, newSchedule];
    });
  };

  const removeSchedule = (oldSchedule: Schedule) => {
    //既存のscheduleList ー 追加したい予定
    setScheduleList((prevList: Schedule[]) => {
      const tempScheduleList = [...prevList];
      const indexNumber = tempScheduleList.findIndex(
        (item: Schedule) =>
          item.title == oldSchedule.title &&
          item.date == oldSchedule.date &&
          item.beforeTime == oldSchedule.beforeTime &&
          item.afterTime == oldSchedule.afterTime &&
          item.memo == oldSchedule.memo &&
          item.allday == oldSchedule.allday
      );
      if (indexNumber != -1) tempScheduleList.splice(indexNumber, 1);

      return tempScheduleList;
    });
  };

  const rewriteSchedule = (oldSchedule: Schedule, newSchedule: Schedule) => {
    setScheduleList((prevList: Schedule[]) => {
      const tempScheduleList = [...prevList];
      const indexNumber = tempScheduleList.findIndex(
        // ここ、id比べるだけで良くなる（データベースの導入によって）
        (item: Schedule) =>
          item.title == oldSchedule.title &&
          item.date == oldSchedule.date &&
          item.beforeTime == oldSchedule.beforeTime &&
          item.afterTime == oldSchedule.afterTime &&
          item.memo == oldSchedule.memo &&
          item.allday == oldSchedule.allday
      );
      if (indexNumber != -1)
        tempScheduleList.splice(indexNumber, 1, newSchedule);

      return tempScheduleList;
    });
  };

  const [holidayList, setHolidayList] = useState<Holidays[]>([]);

  useEffect(() => {
    const req = new XMLHttpRequest(); // XMLHttpRequest オブジェクトを生成する
    req.onreadystatechange = () => {
      if (req.readyState == 4 && req.status == 200) {
        // サーバーからのレスポンスが完了し、かつ、通信が正常に終了した場合

        // 初期化(useEffectを２回実行しないようにする)
        setHolidayList((prevList: Holidays[]) => {
          let tempScheduleList = [...prevList];
          tempScheduleList = [];
          return tempScheduleList;
        });

        const jsonObj = JSON.parse(req.responseText);

        for (const key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
            const val = jsonObj[key];

            const temp: Holidays = {
              title: val,
              date: key,
            };

            setHolidayList((prevList: Holidays[]) => {
              const tempScheduleList = [...prevList];
              tempScheduleList.push(temp);
              return tempScheduleList;
            });
          }
        }
      }
    };
    req.open("GET", "https://holidays-jp.github.io/api/v1/date.json", false); // HTTPメソッドとアクセスするサーバーの　URL　を指定
    req.send(null); // 実際にサーバーへリクエストを送信
  }, []);

  return (
    <Center
      sx={{
        width: "100vw",
        height: "100vh",
        margin: "0 auto",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <Box>
        <HStack>
          <IconContext.Provider value={{ color: "4db56a", size: "50px" }}>
            <GoCalendar />
            <Text fontSize="2xl">カレンダー</Text>
          </IconContext.Provider>

          <Spacer />
          <IconContext.Provider value={{ size: "50px" }}>
            <BiChevronLeft onClick={handleChevronLeftClick} /*前月へ*/ />
            <Text fontSize="xl">
              {nowYear}年 {nowMonth + 1}月
            </Text>
            <BiChevronRight onClick={handleChevronRightClick} /*次月へ*/ />
          </IconContext.Provider>
        </HStack>

        <TableContainer>
          <Table variant="simple" size="lg">
            <Thead>
              <Tr>
                <Th border="1px solid black" px={2} color="tomato">
                  <Text>日曜日</Text>
                </Th>

                <Th border="1px solid black" px={2}>
                  <Text>月曜日</Text>
                </Th>

                <Th border="1px solid black" px={2}>
                  <Text>火曜日</Text>
                </Th>

                <Th border="1px solid black" px={2}>
                  <Text>水曜日</Text>
                </Th>

                <Th border="1px solid black" px={2}>
                  <Text>木曜日</Text>
                </Th>

                <Th border="1px solid black" px={2}>
                  <Text>金曜日</Text>
                </Th>

                <Th border="1px solid black" px={2} color="Blue">
                  <Text>土曜日</Text>
                </Th>
              </Tr>
            </Thead>

            <MakeMonth
              nowMonth={nowMonth}
              nowYear={nowYear}
              scheduleList={scheduleList}
              addSchedule={addSchedule}
              removeSchedule={removeSchedule}
              rewriteSchedule={rewriteSchedule}
              holidayList={holidayList.filter((value) => {
                const month = ("00" + (nowMonth + 1).toString()).slice(-2);
                const deleted = value.date.slice(0, -2);
                return deleted === nowYear.toString() + "-" + month + "-";
              })}
            />
          </Table>
        </TableContainer>
      </Box>
    </Center>
  );
};

export default App;
