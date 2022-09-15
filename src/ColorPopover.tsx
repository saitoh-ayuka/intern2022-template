import {
  Box,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  RadioGroup,
  HStack,
  Radio,
  useDisclosure,
} from "@chakra-ui/react";
import type React from "react";
import { useState } from "react";
import { IoIosColorFill } from "react-icons/io";

type Props = {
  setColorName: (value: React.SetStateAction<string>) => void;
  defaultColor: string;
};

export const ColorChoicePopover: React.FC<Props> = (props: Props) => {
  const {
    onOpen: onOpenColorChoisePopover,
    onClose: onCloseColorChoisePopover,
    isOpen: isOpenColorChoisePopover,
  } = useDisclosure();

  const [colorValue, setColorValue] = useState(props.defaultColor);

  const onCloseAndInitPopover = () => {
    setColorValue(props.defaultColor);
    onCloseColorChoisePopover();
  };

  const onOpenAndInitPopover = () => {
    setColorValue(props.defaultColor);
    onOpenColorChoisePopover();
  };

  const handleChange = (ColorName: string) => {
    setColorValue(ColorName);
    props.setColorName(ColorName);
  };

  return (
    <Popover
      isOpen={isOpenColorChoisePopover}
      onClose={onCloseAndInitPopover}
      placement="right"
    >
      <PopoverTrigger>
        <Box onClick={onOpenAndInitPopover}>
          <IoIosColorFill />
        </Box>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>予定色の選択</PopoverHeader>
        <RadioGroup
          value={colorValue}
          onChange={(ColorName) => handleChange(ColorName)}
          defaultValue={props.defaultColor}
        >
          <HStack>
            <Text> </Text>
            <Radio size="sm" colorScheme="red" value="red.400">
              赤色
            </Radio>
            <Radio size="sm" colorScheme="blue" value="blue.400">
              青色
            </Radio>
            <Radio size="sm" colorScheme="yellow" value="yellow.400">
              黄色
            </Radio>
            <Radio size="sm" colorScheme="green" value="green.400">
              緑色
            </Radio>
          </HStack>
          <HStack>
            <Text> </Text>
            <Radio size="sm" colorScheme="orange" value="orange.400">
              橙色
            </Radio>
            <Radio size="sm" colorScheme="purple" value="purple.400">
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
  );
};
