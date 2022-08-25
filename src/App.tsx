import { useCallback, useEffect, useState } from "react";
import { Center, Image } from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import type { ImageProps } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Spacer, HStack, VStack, Box, Text } from "@chakra-ui/react";
import { IconContext } from "react-icons";
import { GoCalendar } from "react-icons/Go";
import { BiChevronLeft, BiChevronRight } from "react-icons/Bi";

function make_calendar(year: number, month: number) {
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
}

function planMaker() {
  console.log(111);
  return 0;
}

function makeMonth(nowYear: number, nowMonth: number) {
  const today = new Date();

  // カレンダー作る
  const month_days = make_calendar(nowYear, nowMonth);

  // リスト状にして出す
  const listCalender = month_days.map((weekdays, index) => (
    <Tr key={index}>
      {weekdays.map((oneday, index) => {
        if (oneday == null) {
          return <Td key={index} padding={0} border="1px solid black"></Td>;
        } else if (
          oneday == today.getDate() &&
          today.getMonth() == nowMonth &&
          today.getFullYear() == nowYear
        ) {
          return (
            <Td
              key={index}
              padding={1}
              border="1px solid black"
              h="110px"
              w="150px"
              verticalAlign="top"
            >
              <Box onClick={planMaker}>
                <Box bg="green.300" px={1} h={1}></Box>
                <Text color="green.300">{oneday}日</Text>
                <Box bg="green">
                  <Text color="white">予定</Text>
                </Box>
              </Box>
            </Td>
          );
        } else {
          return (
            <Td
              key={index}
              padding={1}
              border="1px solid black"
              h="110px"
              w="150px"
              verticalAlign="top"
            >
              <Box flex="1">
                <Text>{oneday}日</Text>
                {/* <Box bg='green.200' flex='1'>予定</Box> */}
              </Box>
            </Td>
          );
        }
      })}
    </Tr>
  ));
  return listCalender;
}

function App() {
  const today = new Date();

  const [nowMonth, setNowMonth] = useState<number>(today.getMonth());
  const [nowYear, setNowYear] = useState<number>(today.getFullYear());

  function handleChevronLeftClick() {
    // ()の中身通りに変数を変更する
    if (nowMonth >= 1) setNowMonth(nowMonth - 1);
    else if (nowMonth < 1) {
      // 去年の１２月へ行く
      setNowMonth(nowMonth + 11);
      setNowYear(nowYear - 1);
    }
  }

  function handleChevronRightClick() {
    // ()の中身通りに変数を変更する
    if (nowMonth < 11) setNowMonth(nowMonth + 1);
    else if (nowMonth >= 11) {
      // 来年の１月へ行く
      setNowMonth(nowMonth - 11);
      setNowYear(nowYear + 1);
    }
  }

  const viewMonth = makeMonth(nowYear, nowMonth);

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
                <Th border="1px solid black">
                  <Text>日曜日</Text>
                </Th>

                <Th border="1px solid black">
                  <Text>月曜日</Text>
                </Th>

                <Th border="1px solid black">
                  <Text>火曜日</Text>
                </Th>

                <Th border="1px solid black">
                  <Text>水曜日</Text>
                </Th>

                <Th border="1px solid black">
                  <Text>木曜日</Text>
                </Th>

                <Th border="1px solid black">
                  <Text>金曜日</Text>
                </Th>

                <Th border="1px solid black">
                  <Text>土曜日</Text>
                </Th>
              </Tr>
            </Thead>

            <Tbody>{viewMonth}</Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Center>
  );
}

export default App;
