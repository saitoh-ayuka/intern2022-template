import type React from "react";
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Spacer,
  Switch,
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
import { BiEditAlt } from "react-icons/bi";
import { IoMdTime } from "react-icons/io";
import { RiSave3Line } from "react-icons/ri";
import { IoIosColorFill } from "react-icons/io";

import { IconContext } from "react-icons";
import type { Holidays } from "./App";
import type { addSchedule, Schedule } from "./@types/Schedule";

type Props = {
  nowYear: number;
  nowMonth: number;
  oneday: number;

  scheduleList: Schedule[];
  holidayList: Holidays[];
  addSchedule: (Schedule: addSchedule) => void;
  removeSchedule: (oldScheduleId: number) => void;
  rewriteSchedule: (newSchedule: Schedule, oldScheduleId: number) => void;
};

export const Oneday: React.FC<Props> = (props: Props) => {
  const {
    onOpen: onOpenTitleInputPopover,
    onClose: onCloseTitleInputPopover,
    isOpen: isOpenTitleInputPopover,
  } = useDisclosure();

  const {
    onOpen: onOpenViewOnlyTitleInputPopover,
    onClose: onCloseViewOnlyTitleInputPopover,
    isOpen: isViewOnlyTitleInputPopover,
  } = useDisclosure();

  const {
    onOpen: onOpenDetailPopover,
    onClose: onCloseDetailPopover,
    isOpen: isOpenDetailPopover,
  } = useDisclosure();

  const {
    onOpen: onOpenEditPopover,
    onClose: onCloseEditPopover,
    isOpen: isOpenEditPopover,
  } = useDisclosure();

  const {
    onOpen: onOpenHolidayPopover,
    onClose: onCloseHolidayPopover,
    isOpen: isOpenHolidayPopover,
  } = useDisclosure();

  const {
    onOpen: onOpenColorChoisePopoverMake,
    onClose: onCloseColorChoisePopoverMake,
    isOpen: isOpenColorChoisePopoverMake,
  } = useDisclosure();

  const {
    onOpen: onOpenColorChoisePopoverEdit,
    onClose: onCloseColorChoisePopoverEdit,
    isOpen: isOpenColorChoisePopoverEdit,
  } = useDisclosure();

  const [isOpenAlldaySwitch, setIsOpenAlldaySwitch] = useState<boolean>(false);

  const [TitleInput, setTytleInput] = useState<string>("");
  const [MemoInput, setMemoInput] = useState<string | null>("");
  const [DateInput, setDateInput] = useState<string>("");
  const [BeforeTimeInput, setBeforeTimeInput] = useState<string | null>("");
  const [AfterTimeInput, setAfterTimeInput] = useState<string | null>("");
  const [planNumber, setPlanNumber] = useState<number>(0);
  const [ColorName, setColorName] = useState("green.400");

  const handleInputChangeDynamic = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value.length <= 10) {
      setTytleInput(event.target.value);
    }
  };

  const handleDateChangeDynamic = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setDateInput(event.target.value);

  const handleBeforeTimeChangeDynamic = (event: {
    target: { value: React.SetStateAction<string | null> };
  }) => setBeforeTimeInput(event.target.value);

  const handleAfterTimeChangeDynamic = (event: {
    target: { value: React.SetStateAction<string | null> };
  }) => setAfterTimeInput(event.target.value);

  const handleMemoChangeDynamic = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.target.value.length <= 255) {
      setMemoInput(event.target.value);
    }
  };

  const handleChangeInitInput = () => {
    if (!isOpenTitleInputPopover) {
      if (!isOpenDetailPopover && !isOpenEditPopover) {
        setTytleInput("");
        setDateInput(() => {
          const month = ("00" + (props.nowMonth + 1).toString()).slice(-2);
          const date = ("00" + props.oneday.toString()).slice(-2);
          return props.nowYear.toString() + "-" + month + "-" + date;
        });
        setBeforeTimeInput(null);
        setAfterTimeInput(null);
        setMemoInput("");
        setIsOpenAlldaySwitch(false);
      }
      if (!isOpenDetailPopover && !isOpenEditPopover && !isOpenHolidayPopover)
        onOpenTitleInputPopover();
    }
  };

  const handleChangeInitDetail = (
    event: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    setPlanNumber(index);
    onOpenDetailPopover();
    event.stopPropagation();
  };

  const handleChangeInitHoliday = (
    event: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    setPlanNumber(index);
    onOpenHolidayPopover();
    event.stopPropagation();
  };

  const handleChangeDeletePlan = () => {
    if (window.confirm("本当に削除してもよろしいでしょうか？")) {
      props.removeSchedule(props.scheduleList[planNumber].id);
      if (planNumber > 0) setPlanNumber(planNumber - 1);
      onCloseDetailPopover();
      onCloseEditPopover();
      setIsOpenAlldaySwitch(false);
    }
  };

  const onCloseAndMakePlanPopover = () => {
    if (TitleInput) {
      props.addSchedule({
        title: TitleInput,
        date: DateInput,
        beforeTime: BeforeTimeInput,
        afterTime: AfterTimeInput,
        memo: MemoInput,
        allday: isOpenAlldaySwitch,
        color: ColorName,
      });
    }
    onCloseTitleInputPopover();
  };

  const onCloseAndEditPlanPopover = () => {
    onOpenEditPopover();
    onCloseDetailPopover();

    console.log("Edit start!", isOpenColorChoisePopoverMake);

    setTytleInput(props.scheduleList[planNumber].title);
    setDateInput(props.scheduleList[planNumber].date);
    setBeforeTimeInput(props.scheduleList[planNumber].beforeTime);
    setAfterTimeInput(props.scheduleList[planNumber].afterTime);
    setMemoInput(props.scheduleList[planNumber].memo);
    setIsOpenAlldaySwitch(props.scheduleList[planNumber].allday);
    setColorName(props.scheduleList[planNumber].color);
  };

  const onCloseAndEditEndPopover = () => {
    props.rewriteSchedule(
      {
        title: TitleInput,
        date: DateInput,
        beforeTime: BeforeTimeInput != "" ? BeforeTimeInput : null,
        afterTime: AfterTimeInput != "" ? AfterTimeInput : null,
        memo: MemoInput,
        allday: isOpenAlldaySwitch,
        color: ColorName,
        id: props.scheduleList[planNumber].id,
      },
      props.scheduleList[planNumber].id
    );

    handleChangeInitInput();
    onCloseEditPopover();
    onCloseTitleInputPopover();
  };

  const onMouseOut = () => {
    if (!isOpenTitleInputPopover) onCloseViewOnlyTitleInputPopover();
  };

  const onMouseOver = () => {
    if (!isOpenTitleInputPopover && !isOpenEditPopover && !isOpenDetailPopover)
      setTytleInput("");
    if (!isOpenEditPopover && !isOpenDetailPopover)
      onOpenViewOnlyTitleInputPopover();
  };

  const onAlldaySwitch = () => {
    setBeforeTimeInput(null);
    setAfterTimeInput(null);
    setIsOpenAlldaySwitch((prev) => !prev);
  };

  useEffect(() => {
    console.log(isOpenColorChoisePopoverMake);
  }, [isOpenColorChoisePopoverMake]);

  return (
    <Box
      h="100%"
      w="100%"
      onClick={handleChangeInitInput}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      {/* １日〜３１日の表示、今日なら色を分ける */}
      <ViewDays
        nowYear={props.nowYear}
        nowMonth={props.nowMonth}
        oneday={props.oneday}
        holidayList={props.holidayList}
      />
      {/* 祝日ポップオーバー */}
      <Popover
        isOpen={isOpenHolidayPopover}
        onClose={onCloseHolidayPopover}
        placement="right"
      >
        <PopoverTrigger>
          <Box>
            {/*祝日を表示*/}
            {props.holidayList.length >= 1 && (
              <>
                {props.holidayList.map((holidayList, index) => (
                  <Box
                    key={index}
                    bg="green.400"
                    color="white"
                    onClick={(event) => handleChangeInitHoliday(event, index)}
                  >
                    {holidayList.title}
                  </Box>
                ))}
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
                <PopoverCloseButton />
              </HStack>
            </PopoverHeader>
            <VStack spacing={4} align="flex-start">
              <IconContext.Provider value={{ size: "30px" }}>
                <Text> </Text>
                {props.holidayList.length && (
                  <>
                    <HStack>
                      <MdTitle />
                      <Text>{props.holidayList[planNumber].title}</Text>
                    </HStack>
                    <HStack>
                      <FaRegCalendarCheck />
                      <Text>{props.holidayList[planNumber].date}</Text>
                    </HStack>
                    <HStack>
                      <IoMdTime />
                      <Text>終日</Text>
                    </HStack>
                  </>
                )}
              </IconContext.Provider>
            </VStack>
          </FocusLock>
        </PopoverContent>
      </Popover>
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
                {props.scheduleList.map((schedule, index) => (
                  <Box
                    key={index}
                    bg={schedule.color}
                    color="white"
                    onClick={(event) => handleChangeInitDetail(event, index)}
                  >
                    {schedule.title}
                  </Box>
                ))}
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
                {/* 予定編集ポップオーバー、起動 */}
                <BiEditAlt onClick={onCloseAndEditPlanPopover} />
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
                      <Text>{props.scheduleList[planNumber].title}</Text>
                    </HStack>
                    <HStack>
                      <FaRegCalendarCheck />
                      <Text>{props.scheduleList[planNumber].date}</Text>
                    </HStack>
                    <HStack>
                      <IoMdTime />
                      <Text>
                        {props.scheduleList[planNumber].allday && <>終日</>}
                        {!props.scheduleList[planNumber].allday &&
                          props.scheduleList[planNumber].beforeTime}
                      </Text>
                      <Text>
                        {!props.scheduleList[planNumber].allday &&
                          props.scheduleList[planNumber].afterTime && <>~</>}
                      </Text>
                      <Text>
                        {!props.scheduleList[planNumber].allday &&
                          props.scheduleList[planNumber].afterTime}
                      </Text>
                    </HStack>
                    <HStack>
                      <BsChatText />
                      <Text width={"230px"} style={{ whiteSpace: "pre-wrap" }}>
                        {props.scheduleList[planNumber].memo}
                      </Text>
                    </HStack>
                  </>
                )}
              </IconContext.Provider>
            </VStack>
          </FocusLock>
        </PopoverContent>
      </Popover>
      {/* 予定編集ポップオーバー */}
      <Popover
        isOpen={isOpenEditPopover}
        onClose={onCloseAndEditEndPopover}
        placement="right"
        closeOnBlur={
          !(TitleInput === "") &&
          !(DateInput === "") &&
          !isOpenColorChoisePopoverMake
        }
      >
        <PopoverTrigger>
          <Box></Box>
        </PopoverTrigger>
        <PopoverContent p={5}>
          <FocusLock returnFocus persistentFocus={false}>
            <PopoverArrow />
            <PopoverHeader fontWeight="semibold">
              <HStack>
                <Text>予定の編集</Text>
                <Spacer />
                {/* 予定色選択ポップオーバー */}
                <Popover
                  isOpen={isOpenColorChoisePopoverEdit}
                  onClose={() => {
                    console.log("予定の編集 - " + TitleInput);
                    onCloseColorChoisePopoverEdit();
                  }}
                  placement="right"
                >
                  <PopoverTrigger>
                    <Box onClick={onOpenColorChoisePopoverEdit}>
                      <IoIosColorFill />
                    </Box>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>予定色の選択</PopoverHeader>
                    <RadioGroup
                      onChange={(ColorNumber) => setColorName(ColorNumber)}
                      defaultValue="green.400"
                    >
                      <HStack>
                        <Text> </Text>
                        <Radio size="sm" colorScheme="red" value="red.400">
                          赤色
                        </Radio>
                        <Radio size="sm" colorScheme="blue" value="blue.400">
                          青色
                        </Radio>
                        <Radio
                          size="sm"
                          colorScheme="yellow"
                          value="yellow.400"
                        >
                          黄色
                        </Radio>
                        <Radio size="sm" colorScheme="green" value="green.400">
                          緑色
                        </Radio>
                      </HStack>
                      <HStack>
                        <Text> </Text>
                        <Radio
                          size="sm"
                          colorScheme="orange"
                          value="orange.400"
                        >
                          橙色
                        </Radio>
                        <Radio
                          size="sm"
                          colorScheme="purple"
                          value="purple.400"
                        >
                          紫色
                        </Radio>
                        <Radio size="sm" colorScheme="pink" value="pink.400">
                          桃色
                        </Radio>
                        <Radio size="sm" colorScheme="gray" value="gray.400">
                          鼠色
                        </Radio>
                      </HStack>
                    </RadioGroup>
                  </PopoverContent>
                </Popover>
                <RiSave3Line onClick={onCloseAndEditEndPopover} />
                <GoTrashcan onClick={handleChangeDeletePlan} />
                <PopoverCloseButton />
              </HStack>
            </PopoverHeader>
            <VStack spacing={4}>
              <FormControl isInvalid={TitleInput === ""}>
                <Input
                  value={TitleInput}
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
                  value={BeforeTimeInput ?? ""}
                  onChange={handleBeforeTimeChangeDynamic}
                  readOnly={isOpenAlldaySwitch}
                />
                <Text>~</Text>
                <Input
                  size="md"
                  type="time"
                  value={AfterTimeInput ?? ""}
                  onChange={handleAfterTimeChangeDynamic}
                  readOnly={isOpenAlldaySwitch}
                />
              </HStack>
              <HStack>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">終日にしますか？</FormLabel>
                  <Switch
                    isChecked={isOpenAlldaySwitch}
                    onChange={onAlldaySwitch}
                  />
                </FormControl>
              </HStack>
              <Textarea
                id="memo"
                placeholder="memo"
                value={MemoInput ?? ""}
                onChange={handleMemoChangeDynamic}
              />
            </VStack>
          </FocusLock>
        </PopoverContent>
      </Popover>

      {/* 予定作成ポップオーバー */}
      <Popover
        isOpen={isOpenTitleInputPopover}
        onClose={onCloseAndMakePlanPopover}
        placement="right"
        closeOnBlur={!(TitleInput === "") && !(DateInput === "")}
      >
        <PopoverTrigger>
          <Box>
            {isViewOnlyTitleInputPopover && (
              <Box
                bg={
                  ColorName.slice(0, -3) +
                  (ColorName != "red.400" && ColorName != "gray.400"
                    ? "200"
                    : "400")
                }
                color={ColorName != "yellow.400" ? "white" : "black"}
              >
                {TitleInput === "" ? "新規作成..." : TitleInput}
              </Box>
            )}
          </Box>
        </PopoverTrigger>
        <PopoverContent p={5}>
          <FocusLock returnFocus persistentFocus={false}>
            <PopoverArrow />
            <PopoverHeader fontWeight="semibold">
              <HStack>
                <Text>予定の作成</Text>
                <Spacer />
                {/* 予定色選択ポップオーバー */}
                <Popover
                  isOpen={isOpenColorChoisePopoverMake}
                  onClose={onCloseColorChoisePopoverMake}
                  placement="right"
                >
                  <PopoverTrigger>
                    <Box onClick={onOpenColorChoisePopoverMake}>
                      <IoIosColorFill />
                    </Box>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>予定色の選択</PopoverHeader>
                    <RadioGroup
                      onChange={(ColorNumber) => setColorName(ColorNumber)}
                      defaultValue="green.400"
                    >
                      <HStack>
                        <Text> </Text>
                        <Radio size="sm" colorScheme="red" value="red.400">
                          赤色
                        </Radio>
                        <Radio size="sm" colorScheme="blue" value="blue.400">
                          青色
                        </Radio>
                        <Radio
                          size="sm"
                          colorScheme="yellow"
                          value="yellow.400"
                        >
                          黄色
                        </Radio>
                        <Radio size="sm" colorScheme="green" value="green.400">
                          緑色
                        </Radio>
                      </HStack>
                      <HStack>
                        <Text> </Text>
                        <Radio
                          size="sm"
                          colorScheme="orange"
                          value="orange.400"
                        >
                          橙色
                        </Radio>
                        <Radio
                          size="sm"
                          colorScheme="purple"
                          value="purple.400"
                        >
                          紫色
                        </Radio>
                        <Radio size="sm" colorScheme="pink" value="pink.400">
                          桃色
                        </Radio>
                        <Radio size="sm" colorScheme="gray" value="gray.400">
                          鼠色
                        </Radio>
                      </HStack>
                    </RadioGroup>
                  </PopoverContent>
                </Popover>
                <PopoverCloseButton />
              </HStack>
            </PopoverHeader>
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
                  value={BeforeTimeInput ?? ""}
                  onChange={handleBeforeTimeChangeDynamic}
                />
                <Text>~</Text>
                <Input
                  size="md"
                  type="time"
                  value={AfterTimeInput ?? ""}
                  onChange={handleAfterTimeChangeDynamic}
                />
              </HStack>
              <HStack>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">終日にしますか？</FormLabel>
                  <Switch
                    isChecked={isOpenAlldaySwitch}
                    onChange={onAlldaySwitch}
                  />
                </FormControl>
              </HStack>
              <Textarea
                id="memo"
                placeholder="memo"
                value={MemoInput ?? ""}
                onChange={handleMemoChangeDynamic}
              />
            </VStack>
          </FocusLock>
        </PopoverContent>
      </Popover>
    </Box>
  );
};
