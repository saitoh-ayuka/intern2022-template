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
  Spacer,
  Switch,
  Textarea,
  VStack,
  Text,
} from "@chakra-ui/react";
import FocusLock from "react-focus-lock";
import type React from "react";
import { useState } from "react";
import { GoTrashcan } from "react-icons/go";
import { RiSave3Line } from "react-icons/ri";
import { ColorChoicePopover } from "./ColorPopover";
import type { Schedule } from "./@types/Schedule";

type Props = {
  nowYear: number;
  nowMonth: number;
  oneday: number;

  schedule: Schedule;
  handleChangeDeletePlan: () => void;
  rewriteSchedule: (newSchedule: Schedule, oldScheduleId: number) => void;

  handleChangeInitInput: () => void;
  onCloseTitleInputPopover: () => void;
  onCloseDetailPopover: () => void;

  onCloseEditPopover: () => void;
  isOpenEditPopover: boolean;
};

export const PlanEditPopover: React.FC<Props> = (props: Props) => {
  const [TitleInput, setTytleInput] = useState<string>(props.schedule.title);
  const [DateInput, setDateInput] = useState<string>(props.schedule.date);
  const [BeforeTimeInput, setBeforeTimeInput] = useState<string | null>(
    props.schedule.beforeTime
  );
  const [AfterTimeInput, setAfterTimeInput] = useState<string | null>(
    props.schedule.afterTime
  );
  const [isOpenAlldaySwitch, setIsOpenAlldaySwitch] = useState<boolean>(
    props.schedule.allday
  );
  const [MemoInput, setMemoInput] = useState<string | null>(
    props.schedule.memo
  );
  const [ColorName, setColorName] = useState(props.schedule.color);

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

  const onCloseAndInitPopover = () => {
    setTytleInput(props.schedule.title);
    setDateInput(props.schedule.date);
    setBeforeTimeInput(props.schedule.beforeTime);
    setAfterTimeInput(props.schedule.afterTime);
    setIsOpenAlldaySwitch(props.schedule.allday);
    setMemoInput(props.schedule.memo);
    setColorName(props.schedule.color);

    props.onCloseEditPopover();
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
        id: props.schedule.id,
      },
      props.schedule.id
    );

    props.handleChangeInitInput();
    props.onCloseEditPopover();
    props.onCloseTitleInputPopover();
  };

  return (
    <Popover
      isOpen={props.isOpenEditPopover}
      onClose={onCloseAndInitPopover}
      placement="right"
      closeOnBlur={!(TitleInput === "") && !(DateInput === "")}
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
              <ColorChoicePopover
                setColorName={setColorName}
                defaultColor={props.schedule.color}
              ></ColorChoicePopover>
              <RiSave3Line onClick={onCloseAndEditEndPopover} />
              <GoTrashcan onClick={props.handleChangeDeletePlan} />
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
  );
};
