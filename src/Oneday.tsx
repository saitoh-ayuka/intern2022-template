import type React from "react";
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  HStack,
  Input,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import FocusLock from "react-focus-lock";

import { useEffect, useState } from "react";
import { ViewDays } from "./ViewDays";
import { MdTitle } from "react-icons/md";
import { BsChatText } from "react-icons/bs";
import { FaRegCalendarCheck } from "react-icons/fa";
import { GoTrashcan } from "react-icons/go";

import { IoMdTime } from "react-icons/io";

import { IconContext } from "react-icons";
import type { Schedule } from "./App";

type Props = {
  nowYear: number;
  nowMonth: number;
  oneday: number;

  scheduleList: Schedule[];
  addSchedule: (Schedule: Schedule) => void;
};

export const Oneday: React.FC<Props> = (props: Props) => {
  const {
    onOpen: onOpenTitleInputPopover,
    onClose: onCloseTitleInputPopover,
    isOpen: isOpenTitleInputPopover,
  } = useDisclosure();

  const {
    onOpen: onOpenDetailPopover,
    onClose: onCloseDetailPopover,
    isOpen: isOpenDetailPopover,
  } = useDisclosure();

  const [TitleInput, setTytleInput] = useState<string>("");
  const [MemoInput, setMemoInput] = useState<string>("");
  const [DateInput, setDateInput] = useState<string>("");
  const [BeforeTimeInput, setBeforeTimeInput] = useState<string>("");
  const [AfterTimeInput, setAfterTimeInput] = useState<string>("");
  const [IsTitleInputEmpty, setIsTitleInput] = useState(false);

  const handleInputChangeDynamic = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value.length <= 10) {
      setTytleInput(event.target.value);
      setIsTitleInput(true);
    }
  };

  const handleDateChangeDynamic = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setDateInput(event.target.value);

  const handleBeforeTimeChangeDynamic = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setBeforeTimeInput(event.target.value);

  const handleAfterTimeChangeDynamic = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setAfterTimeInput(event.target.value);

  const handleMemoChangeDynamic = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setMemoInput(event.target.value);

  const handleChangeInitInput = () => {
    if (isOpenTitleInputPopover == false) {
      if (!(TitleInput === "") && !isOpenDetailPopover) {
        setTytleInput("");
        setDateInput("");
        setBeforeTimeInput("");
        setAfterTimeInput("");
        // setMemoInput("");
        setIsTitleInput(false);
      }
      if (!isOpenDetailPopover) onOpenTitleInputPopover();
    }
  };

  const handleChangeInitDetail = (event: React.MouseEvent<HTMLDivElement>) => {
    onOpenDetailPopover();
    event.stopPropagation();
  };

  const handleChangeDeletePlan = () => {
    if (isOpenDetailPopover) {
      setTytleInput("");
      setDateInput("");
      setBeforeTimeInput("");
      setAfterTimeInput("");
      // setMemoInput("");
      setIsTitleInput(false);

      onCloseDetailPopover();
    }
  };

  const onCloseAndMakePlanPopover = () => {
    props.addSchedule({
      title: TitleInput,
      date: DateInput,
      beforeTime: BeforeTimeInput,
      afterTime: AfterTimeInput,
      memo: MemoInput,
    });
    // props.setScheduleList(props.allSchedule);
    onCloseTitleInputPopover();
  };

  return (
    <Box h="100%" w="100%" onClick={handleChangeInitInput}>
      {/* １日〜３１日の表示、今日なら色を分ける */}
      <ViewDays
        nowYear={props.nowYear}
        nowMonth={props.nowMonth}
        oneday={props.oneday}
      />

      {/* 予定詳細ポップオーバー */}
      <Popover
        isOpen={isOpenDetailPopover}
        onClose={onCloseDetailPopover}
        placement="right"
      >
        <PopoverTrigger>
          <Box>
            {/* 入力済みの予定を表示 */}
            {props.scheduleList.length >= 1 && (
              <>
                <Box
                  bg="green.400"
                  color="white"
                  onClick={handleChangeInitDetail}
                >
                  {props.scheduleList[0].title}
                </Box>
              </>
            )}
          </Box>
        </PopoverTrigger>
        <PopoverContent p={5}>
          <FocusLock returnFocus persistentFocus={false}>
            <PopoverArrow />
            <PopoverHeader fontWeight="semibold">
              <HStack>
                <Text>予定の詳細</Text>
                <Spacer />
                <GoTrashcan onClick={handleChangeDeletePlan} />
                <PopoverCloseButton />
              </HStack>
            </PopoverHeader>
            <VStack spacing={4} align="flex-start">
              <IconContext.Provider value={{ size: "30px" }}>
                <Text> </Text>
                {props.scheduleList.length && (
                  <>
                    <HStack>
                      <MdTitle />
                      <Text>{props.scheduleList[0].title}</Text>
                    </HStack>
                    <HStack>
                      <FaRegCalendarCheck />
                      <Text>{props.scheduleList[0].date}</Text>
                    </HStack>
                    <HStack>
                      <IoMdTime />
                      <Text>{props.scheduleList[0].beforeTime}</Text>
                      <Text>{props.scheduleList[0].afterTime && <>~</>}</Text>
                      <Text>{props.scheduleList[0].afterTime}</Text>
                    </HStack>
                    <HStack>
                      <BsChatText />
                      <Text style={{ whiteSpace: "pre-line" }}>
                        {props.scheduleList[0].memo}
                      </Text>
                    </HStack>
                  </>
                )}
              </IconContext.Provider>
            </VStack>
          </FocusLock>
        </PopoverContent>
      </Popover>
      {/* 予定作成ポップオーバー */}
      <Popover
        isOpen={isOpenTitleInputPopover}
        onClose={onCloseAndMakePlanPopover}
        placement="right"
        closeOnBlur={!(TitleInput === "")}
      >
        <PopoverTrigger>
          <Box>
            {isOpenTitleInputPopover && (
              <Box bg="green.200" color="white">
                {TitleInput === "" ? "新規作成..." : TitleInput}
              </Box>
            )}
          </Box>
        </PopoverTrigger>
        <PopoverContent p={5}>
          <FocusLock returnFocus persistentFocus={false}>
            <PopoverArrow />
            <PopoverHeader fontWeight="semibold">予定の作成</PopoverHeader>
            <PopoverCloseButton />
            <VStack spacing={4}>
              <FormControl isInvalid={TitleInput === ""}>
                <Input
                  value={TitleInput ?? ""}
                  placeholder="タイトルを入力"
                  onChange={handleInputChangeDynamic}
                />
                {!(TitleInput === "") ? (
                  <FormHelperText></FormHelperText>
                ) : (
                  <FormErrorMessage>
                    タイトルを入力して下さい。（10文字以内）
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={DateInput === ""}>
                <Input
                  size="md"
                  type="date"
                  value={DateInput}
                  onChange={handleDateChangeDynamic}
                />
                {!(DateInput === "") ? (
                  <FormHelperText></FormHelperText>
                ) : (
                  <FormErrorMessage>日付を指定して下さい。</FormErrorMessage>
                )}
              </FormControl>
              <HStack>
                <Input
                  size="md"
                  type="time"
                  value={BeforeTimeInput}
                  onChange={handleBeforeTimeChangeDynamic}
                />
                <Text>~</Text>
                <Input
                  size="md"
                  type="time"
                  value={AfterTimeInput}
                  onChange={handleAfterTimeChangeDynamic}
                />
              </HStack>
              <Textarea
                id="memo"
                placeholder="memo"
                value={MemoInput}
                // onChange={handleMemoChangeDynamic}
              />
            </VStack>
          </FocusLock>
        </PopoverContent>
      </Popover>
    </Box>
  );
};
