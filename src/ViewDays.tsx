import { Box, Text } from "@chakra-ui/react";

type Props = {
  nowYear: number;
  nowMonth: number;
  oneday: number;
};

export const ViewDays: React.FC<Props> = (props: Props) => {
  const today = new Date();

  return (
    <Box>
      {/* 今日の日付＋緑四角 */}
      {props.oneday == today.getDate() &&
        today.getMonth() == props.nowMonth &&
        today.getFullYear() == props.nowYear && (
          <>
            <Box bg="green.300" px={1} h={1}></Box>
            <Text color="green.300">{props.oneday}日</Text>
          </>
        )}
      {/* 普通の日 */}
      {(props.oneday == today.getDate() &&
        today.getMonth() == props.nowMonth &&
        today.getFullYear() == props.nowYear) || (
        <>
          <Text>{props.oneday}日</Text>
        </>
      )}
    </Box>
  );
};
