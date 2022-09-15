import {
  Box,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  HStack,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Spacer,
  Switch,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import FocusLock from "react-focus-lock";
import type React from "react";
import { useState } from "react";
import type { addSchedule } from "./@types/Schedule";
import { ColorChoicePopover } from "./ColorPopover";
import { supabase } from "./Datebase";

type Props = {
  nowYear: number;
  nowMonth: number;
  oneday: number;

  addSchedule: (Schedule: addSchedule) => void;
  isViewOnlyTitleInputPopover: boolean;
  onCloseTitleInputPopover: () => void;
  isOpenTitleInputPopover: boolean;
};

export const PlanMakePopover: React.FC<Props> = (props: Props) => {
  const [TitleInput, setTytleInput] = useState<string>("");
  const [DateInput, setDateInput] = useState<string>(() => {
    const month = ("00" + (props.nowMonth + 1).toString()).slice(-2);
    const date = ("00" + props.oneday.toString()).slice(-2);
    return props.nowYear.toString() + "-" + month + "-" + date;
  });
  const [BeforeTimeInput, setBeforeTimeInput] = useState<string | null>(null);
  const [AfterTimeInput, setAfterTimeInput] = useState<string | null>(null);
  const [isOpenAlldaySwitch, setIsOpenAlldaySwitch] = useState<boolean>(false);
  const [MemoInput, setMemoInput] = useState<string | null>(null);
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

  const onAlldaySwitch = () => {
    setBeforeTimeInput(null);
    setAfterTimeInput(null);
    setIsOpenAlldaySwitch((prev) => !prev);
  };

  const onCloseAndMakePlanPopover = () => {
    if (TitleInput) {
      const user = supabase.auth.user();
      props.addSchedule({
        title: TitleInput,
        date: DateInput,
        beforeTime: BeforeTimeInput,
        afterTime: AfterTimeInput,
        memo: MemoInput,
        allday: isOpenAlldaySwitch,
        color: ColorName,
        user_id: user != null ? user.id : null,
      });
    }
    props.onCloseTitleInputPopover();

    setTytleInput("");
    setDateInput(() => {
      const month = ("00" + (props.nowMonth + 1).toString()).slice(-2);
      const date = ("00" + props.oneday.toString()).slice(-2);
      return props.nowYear.toString() + "-" + month + "-" + date;
    });
    setBeforeTimeInput(null);
    setAfterTimeInput(null);
    setMemoInput(null);
    setIsOpenAlldaySwitch(false);
    setColorName("green.400");
  };

  return (
    <Popover
      isOpen={props.isOpenTitleInputPopover}
      onClose={onCloseAndMakePlanPopover}
      placement="right"
      closeOnBlur={!(TitleInput === "") && !(DateInput === "")}
    >
      <PopoverTrigger>
        <Box>
          {props.isViewOnlyTitleInputPopover && (
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
              <ColorChoicePopover
                setColorName={setColorName}
                defaultColor={ColorName}
              ></ColorChoicePopover>
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
  );
};
