import { useState } from "react";
import { Center } from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import {
  Spacer,
  HStack,
  VStack,
  Box,
  Text,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { IconContext } from "react-icons";
import { GoCalendar } from "react-icons/go";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import type React from "react";
import { useDisclosure } from "@chakra-ui/react";
import FocusLock from "react-focus-lock";

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

const MakeMonth = (nowYear: number, nowMonth: number) => {
  // カレンダー作る
  const month_days = make_calendar(nowYear, nowMonth);

  // リスト状にして出す
  const listCalender = month_days.map((weekdays, index) => (
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
              {Oneday(nowYear, nowMonth, index, oneday)}
            </Td>
          );
        }
      })}
    </Tr>
  ));
  return listCalender;
};

const Oneday = (
  nowYear: number,
  nowMonth: number,
  index: number,
  oneday: number
) => {
  const today = new Date();

  const { onOpen, onClose, isOpen } = useDisclosure();

  const [TytleInput, setTytleInput] = useState<string | null>(null);
  const [MemoInput, setMemoInput] = useState<string | null>(null);
  const [IsInput, setIsInput] = useState(false);

  const handleInputChangeDynamic = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value.length <= 10) {
      setTytleInput(event.target.value);
      setIsInput(true);
    }
  };

  const handleMemoChangeDynamic = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.target.value.length <= 255) {
      setMemoInput(event.target.value);
    }
  };

  function handleChangeInitInput() {
    if (isOpen == false) {
      setTytleInput("");
      setIsInput(false);
      onOpen();
    }
  }
  const isTytleInputError = TytleInput === "";

  return (
    <Box h="100%" w="100%" onClick={handleChangeInitInput}>
      {oneday == today.getDate() &&
        today.getMonth() == nowMonth &&
        today.getFullYear() == nowYear && (
          <>
            <Box bg="green.300" px={1} h={1}></Box>
            <Text color="green.300">{oneday}日</Text>
          </>
        )}
      {(oneday == today.getDate() &&
        today.getMonth() == nowMonth &&
        today.getFullYear() == nowYear) || (
        <>
          <Text>{oneday}日</Text>
        </>
      )}
      <Popover
        isOpen={isOpen}
        onClose={onClose}
        placement="right"
        closeOnBlur={IsInput}
      >
        <PopoverTrigger>
          <Box>
            <Box bg="green.300" color="white">
              {isOpen && !IsInput && "新規作成..."}
            </Box>
          </Box>
        </PopoverTrigger>
        <PopoverContent p={5}>
          <FocusLock returnFocus persistentFocus={false}>
            <PopoverArrow />
            <PopoverHeader fontWeight="semibold">予定の作成</PopoverHeader>
            <PopoverCloseButton />
            <VStack spacing={4}>
              <FormControl isInvalid={isTytleInputError}>
                <Input
                  value={TytleInput ?? ""}
                  placeholder="タイトルを入力"
                  onChange={handleInputChangeDynamic}
                />
                {!isTytleInputError ? (
                  <FormHelperText></FormHelperText>
                ) : (
                  <FormErrorMessage>
                    タイトルを入力して下さい。（10文字以内）
                  </FormErrorMessage>
                )}
              </FormControl>
              <Input size="md" type="date" />
              <HStack>
                <Input size="md" type="time" />
                <text>~</text>
                <Input size="md" type="time" />
              </HStack>
              <Textarea
                id="memo"
                placeholder="memo"
                onChange={handleMemoChangeDynamic}
              />
            </VStack>
          </FocusLock>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

const App = () => {
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

  const viewMonth = MakeMonth(nowYear, nowMonth);

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
              <Th border="1px solid black" px={2}>
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

              <Th border="1px solid black" px={2}>
                <Text>土曜日</Text>
              </Th>
            </Thead>

            <Tbody>{viewMonth}</Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Center>
  );
};

export default App;
