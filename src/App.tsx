import { useEffect, useState } from "react";
import { Button, Center } from "@chakra-ui/react";
import { Table, Thead, Tr, Th, TableContainer } from "@chakra-ui/react";
import { Spacer, HStack, Box, Text } from "@chakra-ui/react";
import { IconContext } from "react-icons";
import { GoCalendar } from "react-icons/go";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { SiSpring } from "react-icons/si";
import { BsSun, BsSnow2 } from "react-icons/bs";
import { GiMapleLeaf } from "react-icons/gi";
import type React from "react";
import { MakeMonth } from "./MakeMonth";
import type { addSchedule, Schedule, ScheduleTable } from "./@types/Schedule";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./Datebase";

export type Holidays = {
  title: string;
  date: string;
};

const App: React.FC = () => {
  const today = new Date();

  const [nowMonth, setNowMonth] = useState<number>(today.getMonth());
  const [nowYear, setNowYear] = useState<number>(today.getFullYear());

  const handleChevronLeftClick = () => {
    // ()の中身通りに変数を変更する
    if (nowMonth >= 1) setNowMonth((nowMonth) => nowMonth - 1);
    else if (nowMonth < 1) {
      // 去年の１２月へ行く
      setNowMonth((nowMonth) => nowMonth + 11);
      setNowYear((nowYear) => nowYear - 1);
    }
  };

  const handleChevronRightClick = () => {
    // ()の中身通りに変数を変更する
    if (nowMonth < 11) setNowMonth((nowMonth) => nowMonth + 1);
    else if (nowMonth >= 11) {
      // 来年の１月へ行く
      setNowMonth((nowMonth) => nowMonth - 11);
      setNowYear((nowYear) => nowYear + 1);
    }
  };

  const [scheduleList, setScheduleList] = useState<Schedule[]>([]);

  const setScheduleFromDB = async () => {
    const response = await supabase
      .from<ScheduleTable>("Schedule") // Message maps to the type of the row in your database.
      .select("*");

    const list = response.data ?? [];

    // mapを用いて、list.mapでScheduleListをScheduleに！
    const changed: Schedule[] = list.map((schedule) => {
      // beforeTimeとAfterTimeを秒数なくすように変換する

      const beforeTimeSecondDeleted = (schedule.beforeTime ?? "").slice(0, 5);
      const afterTimeSecondDeleted = (schedule.afterTime ?? "").slice(0, 5);

      return {
        title: schedule.title,
        date: schedule.date,
        beforeTime: beforeTimeSecondDeleted,
        afterTime: afterTimeSecondDeleted,
        memo: schedule.memo,
        allday: schedule.allday,
        color: schedule.color,
        id: schedule.id,
      };
    });

    setScheduleList(changed);
  };

  const addScheduleToDB = async (newSchedule: addSchedule) => {
    const { data, error } = await supabase
      .from<ScheduleTable>("Schedule") // Message maps to the type of the row in your database.
      .insert(newSchedule);
    void setScheduleFromDB();
  };

  const removeScheduleFromDB = async (oldScheduleId: number) => {
    const { data, error } = await supabase
      .from<ScheduleTable>("Schedule")
      .delete()
      .match({ id: oldScheduleId });
    void setScheduleFromDB();
  };

  const rewriteScheduleFromDB = async (
    newSchedule: Schedule,
    oldScheduleId: number
  ) => {
    const { data, error } = await supabase
      .from<ScheduleTable>("Schedule")
      .update(newSchedule)
      .match({ id: oldScheduleId });
    void setScheduleFromDB();
  };

  const [holidayList, setHolidayList] = useState<Holidays[]>([]);

  useEffect(() => {
    const req = new XMLHttpRequest(); // XMLHttpRequest オブジェクトを生成する
    req.onreadystatechange = () => {
      if (req.readyState == 4 && req.status == 200) {
        // サーバーからのレスポンスが完了し、かつ、通信が正常に終了した場合

        const jsonObj = JSON.parse(req.responseText) as {
          [key: string]: string;
        };

        const changed: Holidays[] = Object.entries(jsonObj).map(
          ([key, value]) => {
            const temp: Holidays = {
              title: value,
              date: key,
            };

            return temp;
          }
        );

        setHolidayList(changed);
      }
    };
    req.open("GET", "https://holidays-jp.github.io/api/v1/date.json", false); // HTTPメソッドとアクセスするサーバーの URL を指定
    req.send(null); // 実際にサーバーへリクエストを送信
  }, []);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const user = supabase.auth.user();
    setUser(user);
  }, [user]);

  const signInWithGoogle = async () => {
    alert(user);
    if (user == null) {
      const { error } = await supabase.auth.signIn({
        provider: "google",
      });
      console.log("sign in error");
      console.log(error);

      const user = supabase.auth.user();
      alert("tsts");
      console.log(user);
      setUser(user);
      alert("ログインします");
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    console.log("sign out error");
    console.log(error);
    setUser(null);
    alert("ログアウトしました");
  };

  useEffect(() => {
    void setScheduleFromDB();
  }, []);

  return (
    <>
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
            <Spacer />
            <IconContext.Provider value={{ size: "30px" }}>
              {user ? (
                <div>
                  <h3>id:{user.id}</h3>
                  <Button
                    style={{ width: "300px" }}
                    onClick={() => signOut()}
                    size={"large"}
                  >
                    SignOut
                  </Button>
                </div>
              ) : (
                <div>
                  <h3>id:{user}</h3>
                  <Button
                    style={{ width: "300px" }}
                    onClick={() => signInWithGoogle()}
                    size={"large"}
                  >
                    SignUp
                  </Button>
                </div>
              )}
            </IconContext.Provider>
          </HStack>
          <HStack>
            <IconContext.Provider value={{ color: "4db56a", size: "50px" }}>
              <GoCalendar />
              <Text fontSize="2xl">カレンダー</Text>
            </IconContext.Provider>

            <Spacer />
            <IconContext.Provider value={{ size: "50px" }}>
              <BiChevronLeft onClick={handleChevronLeftClick} /*前月へ*/ />
              {
                // 春なら、春のアイコン
                nowMonth + 1 >= 3 && nowMonth + 1 <= 5 && (
                  <SiSpring color="pink" />
                )
              }
              {
                // 夏のアイコン
                nowMonth + 1 >= 6 && nowMonth + 1 <= 8 && (
                  <BsSun color="tomato" />
                )
              }
              {
                // 秋のアイコン
                nowMonth + 1 >= 9 && nowMonth + 1 <= 11 && (
                  <GiMapleLeaf color="brown" />
                )
              }
              {
                // 冬のアイコン
                (nowMonth + 1 == 1 ||
                  nowMonth + 1 == 2 ||
                  nowMonth + 1 == 12) && <BsSnow2 color="#63B3ED" />
              }
              <Text fontSize="xl">
                {nowYear}年 {nowMonth + 1}月
              </Text>
              <BiChevronRight onClick={handleChevronRightClick} /*次月へ*/ />
            </IconContext.Provider>
          </HStack>

          <TableContainer>
            <Table variant="simple" size="lg">
              <Thead>
                <Tr>
                  <Th border="1px solid black" px={2} color="tomato">
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

                  <Th border="1px solid black" px={2} color="#63B3ED">
                    <Text>土曜日</Text>
                  </Th>
                </Tr>
              </Thead>

              <MakeMonth
                nowMonth={nowMonth}
                nowYear={nowYear}
                scheduleList={scheduleList}
                addSchedule={addScheduleToDB}
                removeSchedule={removeScheduleFromDB}
                rewriteSchedule={rewriteScheduleFromDB}
                holidayList={holidayList.filter((value) => {
                  const month = ("00" + (nowMonth + 1).toString()).slice(-2);
                  const deleted = value.date.slice(0, -2);
                  return deleted === nowYear.toString() + "-" + month + "-";
                })}
              />
            </Table>
          </TableContainer>
        </Box>
      </Center>
    </>
  );
};

export default App;
