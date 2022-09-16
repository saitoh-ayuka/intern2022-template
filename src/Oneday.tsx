import type React from "react";
import { Box, useDisclosure } from "@chakra-ui/react";

import { useState } from "react";
import { ViewDays } from "./ViewDays";

import type { Holidays } from "./App";
import type { addSchedule, Schedule } from "./@types/Schedule";
import { PlanMakePopover } from "./PlanMakePopover";
import { HolidayPopover } from "./HolidayPopover";
import { PlanEditPopover } from "./PlanEditPopover";
import { PlanInfoPopover } from "./PlanInfoPopover";

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

  const [, setTytleInput] = useState<string>("");
  const [, setMemoInput] = useState<string | null>("");
  const [, setDateInput] = useState<string>("");
  const [, setBeforeTimeInput] = useState<string | null>("");
  const [, setAfterTimeInput] = useState<string | null>("");
  const [planNumber, setPlanNumber] = useState<number>(0);
  const [, setIsOpenAlldaySwitch] = useState<boolean>(false);
  const [, setColorName] = useState("green.400");

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

  const handleChangeDeletePlan = () => {
    if (window.confirm("本当に削除してもよろしいでしょうか？")) {
      handleRemoveSch(props.scheduleList[planNumber].id);
      onCloseDetailPopover();
      onCloseEditPopover();
      setIsOpenAlldaySwitch(false);
    }
  };

  const handleRemoveSch = (id: number) => {
    props.removeSchedule(id);
    if (planNumber > 0) setPlanNumber(planNumber - 1);
  };

  const onCloseAndEditPlanPopover = () => {
    console.log("Edit before planNumber is", planNumber);
    console.log(
      "Edit before scheduleList[planNumber].title is",
      props.scheduleList[planNumber].title
    );

    setTytleInput(props.scheduleList[planNumber].title);
    setDateInput(props.scheduleList[planNumber].date);
    setBeforeTimeInput(props.scheduleList[planNumber].beforeTime);
    setAfterTimeInput(props.scheduleList[planNumber].afterTime);
    setMemoInput(props.scheduleList[planNumber].memo);
    setIsOpenAlldaySwitch(props.scheduleList[planNumber].allday);
    setColorName(props.scheduleList[planNumber].color);

    onOpenEditPopover();
    onCloseDetailPopover();
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
      <HolidayPopover
        holidayList={props.holidayList}
        onOpenHolidayPopover={onOpenHolidayPopover}
        onCloseHolidayPopover={onCloseHolidayPopover}
        isOpenHolidayPopover={isOpenHolidayPopover}
      />

      {/* 予定詳細ポップオーバー */}
      <PlanInfoPopover
        scheduleList={props.scheduleList}
        planNumber={planNumber}
        onCloseAndEditPlanPopover={onCloseAndEditPlanPopover}
        setPlanNumber={setPlanNumber}
        handleChangeDeletePlan={handleChangeDeletePlan}
        onOpenDetailPopover={onOpenDetailPopover}
        onCloseDetailPopover={onCloseDetailPopover}
        isOpenDetailPopover={isOpenDetailPopover}
      />
      {/* 予定編集ポップオーバー */}
      {props.scheduleList[planNumber] != undefined && (
        <>
          <PlanEditPopover
            nowYear={props.nowYear}
            nowMonth={props.nowMonth}
            oneday={props.oneday}
            schedule={props.scheduleList[planNumber]}
            handleChangeDeletePlan={handleChangeDeletePlan}
            rewriteSchedule={props.rewriteSchedule}
            handleChangeInitInput={handleChangeInitInput}
            onCloseTitleInputPopover={onCloseTitleInputPopover}
            onCloseDetailPopover={onCloseDetailPopover}
            onCloseEditPopover={onCloseEditPopover}
            isOpenEditPopover={isOpenEditPopover}
          />
        </>
      )}

      {/* 予定作成ポップオーバー */}
      <PlanMakePopover
        nowMonth={props.nowMonth}
        nowYear={props.nowYear}
        oneday={props.oneday}
        addSchedule={props.addSchedule}
        isViewOnlyTitleInputPopover={isViewOnlyTitleInputPopover}
        onCloseTitleInputPopover={onCloseTitleInputPopover}
        isOpenTitleInputPopover={isOpenTitleInputPopover}
      />
    </Box>
  );
};
