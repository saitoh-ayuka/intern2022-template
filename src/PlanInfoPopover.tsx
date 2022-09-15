import FocusLock from "react-focus-lock";
import type React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  HStack,
  Spacer,
  PopoverCloseButton,
  VStack,
  Box,
  Text,
} from "@chakra-ui/react";
import { IconContext } from "react-icons";
import { BiEditAlt } from "react-icons/bi";
import { BsChatText } from "react-icons/bs";
import { FaRegCalendarCheck } from "react-icons/fa";
import { GoTrashcan } from "react-icons/go";
import { IoMdTime } from "react-icons/io";
import { MdTitle } from "react-icons/md";
import type { Schedule } from "./@types/Schedule";
import { useEffect } from "react";

type Props = {
  scheduleList: Schedule[];
  planNumber: number;
  onCloseAndEditPlanPopover: () => void;
  setPlanNumber: React.Dispatch<React.SetStateAction<number>>;
  handleChangeDeletePlan: () => void;

  onOpenDetailPopover: () => void;
  onCloseDetailPopover: () => void;
  isOpenDetailPopover: boolean;
};

export const PlanInfoPopover: React.FC<Props> = (props: Props) => {
  const handleChangeInitDetail = (
    event: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    console.log("before plan number is", props.planNumber);

    props.setPlanNumber(index);

    props.onOpenDetailPopover();
    event.stopPropagation();
  };

  useEffect(() => {
    console.log("after plan number is", props.planNumber);
    props.setPlanNumber(props.planNumber);
  }, [props, props.planNumber]);

  return (
    <Popover
      isOpen={props.isOpenDetailPopover}
      onClose={props.onCloseDetailPopover}
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
              <BiEditAlt onClick={props.onCloseAndEditPlanPopover} />
              <GoTrashcan onClick={props.handleChangeDeletePlan} />
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
                    <Text>{props.scheduleList[props.planNumber].title}</Text>
                  </HStack>
                  <HStack>
                    <FaRegCalendarCheck />
                    <Text>
                      {props.scheduleList[props.planNumber].date.slice(0, 4) +
                        "/" +
                        props.scheduleList[props.planNumber].date.slice(5, 7) +
                        "/" +
                        props.scheduleList[props.planNumber].date.slice(8, 10)}
                    </Text>
                  </HStack>
                  <HStack>
                    <IoMdTime />
                    <Text>
                      {props.scheduleList[props.planNumber].allday && <>終日</>}
                      {!props.scheduleList[props.planNumber].allday &&
                        props.scheduleList[props.planNumber].beforeTime}
                    </Text>
                    <Text>
                      {!props.scheduleList[props.planNumber].allday &&
                        props.scheduleList[props.planNumber].afterTime && (
                          <>~</>
                        )}
                    </Text>
                    <Text>
                      {!props.scheduleList[props.planNumber].allday &&
                        props.scheduleList[props.planNumber].afterTime}
                    </Text>
                  </HStack>
                  <HStack>
                    <BsChatText />
                    <Text width={"230px"} style={{ whiteSpace: "pre-wrap" }}>
                      {props.scheduleList[props.planNumber].memo}
                    </Text>
                  </HStack>
                </>
              )}
            </IconContext.Provider>
          </VStack>
        </FocusLock>
      </PopoverContent>
    </Popover>
  );
};
