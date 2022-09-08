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
import FocusLock from "react-focus-lock";
import type React from "react";
import { useState } from "react";
import { IconContext } from "react-icons";
import { FaRegCalendarCheck } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { MdTitle } from "react-icons/md";
import type { Holidays } from "./App";

type Props = {
  holidayList: Holidays[];

  onOpenHolidayPopover: () => void;
  onCloseHolidayPopover: () => void;
  isOpenHolidayPopover: boolean;
};

export const HolidayPopover: React.FC<Props> = (props: Props) => {
  const handleChangeInitHoliday = (
    event: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    setPlanNumber(index);
    props.onOpenHolidayPopover();
    event.stopPropagation();
  };

  const [planNumber, setPlanNumber] = useState<number>(0);

  return (
    <Popover
      isOpen={props.isOpenHolidayPopover}
      onClose={props.onCloseHolidayPopover}
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
  );
};
