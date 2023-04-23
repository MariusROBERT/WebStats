import React, {useEffect} from "react";
import MainHeader from "../components/MainHeader";
import {Center, Container, Flex, MantineProvider, Space, Text} from "@mantine/core";
import {Dropzone} from "@mantine/dropzone";
import {IconPhoto} from "@tabler/icons-react";
import {useMantineTheme} from "@mantine/core";
import {DataTable} from "mantine-datatable";

interface HistoryJson {
  header: string,
  title: string,
  titleUrl: string,
  subtitles: [{
    name: string,
    url: string
  }],
  time: string,
  products: string[],
  activityControls: string[]
}

interface Channel {
  channel: string;
  link: string;
  timeSeen: number;
  timeUniqueSeen: number;
  firstSeen: Date;
  firstSeenDisplay: string;
  lastSeen: Date;
  lastSeenDisplay: string;
}

interface Video {
  title: string;
  link: string;
  channel: string;
  timeSeen: number;
  firstSeen: Date;
  firstSeenDisplay: string;
  lastSeen: Date;
  lastSeenDisplay: string;
}

export default function Youtube() {
  const batchSize = 25;

  const [isLoading, setIsLoading] = React.useState(false);
  const [historyRaw, setHistoryRaw] = React.useState<HistoryJson[]>([]);
  const [historyChannel, setHistoryChannel] = React.useState<Channel[]>([]);
  const [historyChannelDisplay, setHistoryChannelDisplay] = React.useState<Channel[]>([]);
  const [historyVideos, setHistoryVideos] = React.useState<Video[]>([]);
  const [historyVideosDisplay, setHistoryVideosDisplay] = React.useState<Video[]>([]);
  const [videosSeen, setVideosSeen] = React.useState(0);
  const [uniqueVideosSeen, setUniqueVideosSeen] = React.useState(0);
  const [channelsSeen, setChannelsSeen] = React.useState(0);

  const handleDrop = (file: Blob) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target === null) return;
      const text = e.target.result;
      if (typeof text === "string") {
        setHistoryRaw(JSON.parse(text));
      }
    };
    reader.readAsText(file);
  }

  useEffect(() => {
    console.log(historyChannelDisplay);
  }, [historyChannelDisplay])

  useEffect(() => {
        if (historyRaw.length !== 0) {
          let channels: Channel[] = [];
          let videos: Video[] = [];
          console.log(historyRaw.length);
          for (const video of historyRaw) {
            const title = video.title.replace("Vous avez regardé ", "");
            if (title === "Vous avez regardé une vidéo qui a été supprimée" || !video.subtitles) continue;
            const titleURL = video.titleUrl;
            const channel = video.subtitles[0].name;
            const channelURL = video.subtitles[0].url;
            const timeSeen = new Date(video.time);

            const indexVideo = videos.findIndex((item) => item.title === title);
            if (indexVideo !== -1) {
              const item = videos[indexVideo];
              item.timeSeen++;
              if (item.lastSeen < timeSeen) {
                item.lastSeen = timeSeen;
                item.lastSeenDisplay = timeSeen.toLocaleString();
              } else if (item.firstSeen > timeSeen) {
                item.firstSeen = timeSeen;
                item.firstSeenDisplay = timeSeen.toLocaleString();
              }
              videos[indexVideo] = item;
            } else {
              videos.push({
                title: title,
                link: titleURL,
                channel: channel,
                timeSeen: 1,
                firstSeen: timeSeen,
                firstSeenDisplay: timeSeen.toLocaleString(),
                lastSeen: timeSeen,
                lastSeenDisplay: timeSeen.toLocaleString()
              })
            }
          }

          let videosSeen = 0;
          let uniqueVideosSeen = 0;
          let channelsSeen = 0;
          for (const video of videos) {
            const indexChannel = channels.findIndex((item) => item.channel === video.channel);
            videosSeen += video.timeSeen;
            uniqueVideosSeen++;
            if (indexChannel !== -1) {
              const item = channels[indexChannel];
              item.timeSeen += video.timeSeen;
              item.timeUniqueSeen++;
              if (item.lastSeen < video.lastSeen) {
                item.lastSeen = video.lastSeen;
                item.lastSeenDisplay = video.lastSeen.toLocaleString();
              } else if (item.firstSeen > video.firstSeen) {
                item.firstSeen = video.firstSeen;
                item.firstSeenDisplay = video.firstSeen.toLocaleString();
              }
              channels[indexChannel] = item;
            } else {
              channelsSeen++;
              channels.push({
                channel: video.channel,
                link: video.link,
                timeSeen: video.timeSeen,
                timeUniqueSeen: 1,
                firstSeen: video.firstSeen,
                firstSeenDisplay: video.firstSeen.toLocaleString(),
                lastSeen: video.lastSeen,
                lastSeenDisplay: video.lastSeen.toLocaleString()
              })
            }
          }
          setHistoryChannel(channels.sort((a: Channel, b: Channel) => b.timeSeen - a.timeSeen));
          console.log("channels: ", channels.length);
          setHistoryVideos(videos.sort((a: Video, b: Video) => b.timeSeen - a.timeSeen));
          console.log("videos: ", videos.length);
          setHistoryChannelDisplay(channels.slice(0, batchSize));
          setHistoryVideosDisplay(videos.slice(0, batchSize));
          setVideosSeen(videosSeen);
          setUniqueVideosSeen(uniqueVideosSeen);
          setChannelsSeen(channelsSeen);
        }
      }, [historyRaw]
  )

  return (
      <MantineProvider
          theme={{
            colorScheme: "dark",
            primaryColor: "red",
            components: {
              Text: {
                defaultProps: (theme) => ({
                  color: theme.colorScheme === 'dark' ? 'white' : 'dark',
                }),
              },
            }
          }}
      >
        <div className="App" style={{
          height: "100vh",
          backgroundColor: useMantineTheme().colors.dark[4],
        }}>
          <MainHeader currentPage={"Youtube"}/>
          <Center>
            <Container hidden={historyRaw.length !== 0}>
              <Dropzone loading={isLoading}
                        onDrop={(file) => {
                          setIsLoading(true);
                          handleDrop(file[0]);
                          setIsLoading(false);
                        }}
                        style={{width: 600}}
                        radius={"lg"}
                        accept={["application/json"]}
                        maxFiles={1}
              >
                <Dropzone.Idle>
                  <IconPhoto size="75" stroke={1.5} color={useMantineTheme().colors.dark[0]}/>
                </Dropzone.Idle>
                <Text mt={"sm"} size="xl" fw={500} inline color={useMantineTheme().colors.dark[0]}>
                  Drag your watch-history.json file here or click to select it
                </Text>
              </Dropzone>
            </Container>
            <Container hidden={historyRaw.length === 0}>
              <Flex justify={"space-evenly"}>
                <Flex direction={"row"}>
                  <Text fz={"lg"}>
                    Channels seen:&nbsp;
                  </Text>
                  <Text fz={"lg"} fw={800} color={useMantineTheme().primaryColor}>
                    {channelsSeen}
                  </Text>
                </Flex>
                <Space w={"lg"}/>
                <Flex direction={"row"}>
                  <Text fz={"lg"}>
                    Videos seen:&nbsp;
                  </Text>
                  <Text fz={"lg"} fw={800} color={useMantineTheme().primaryColor}>
                    {videosSeen}
                  </Text>
                </Flex>
                <Space w={"lg"}/>
                <Flex direction={"row"}>
                  <Text fz={"lg"}>
                    Unique videos seen:&nbsp;
                  </Text>
                  <Text fz={"lg"} fw={800} color={useMantineTheme().primaryColor}>
                    {uniqueVideosSeen}
                  </Text>
                </Flex>
              </Flex>
              <Space h={"lg"}/>
              <DataTable
                  borderRadius={"sm"}
                  striped
                  highlightOnHover
                  withBorder
                  height={500}
                  columns={[
                    {accessor: "channel", title: "Channel", textAlignment: "center"},
                    {accessor: "timeSeen", title: "Videos viewed", textAlignment: "center"},
                    {accessor: "timeUniqueSeen", title: "Unique videos viewed", textAlignment: "center"},
                    {accessor: "firstSeenDisplay", title: "First viewed", textAlignment: "center", width: "175px"},
                    {accessor: "lastSeenDisplay", title: "Last viewed", textAlignment: "center", width: "175px"},
                  ]}
                  records={historyChannelDisplay}
              />
              <Space h={"md"}/>
              <DataTable
                  borderRadius={"sm"}
                  striped
                  highlightOnHover
                  withBorder
                  height={500}
                  columns={[
                    {accessor: "title", title: "Title", textAlignment: "center"},
                    {accessor: "timeSeen", title: "Time viewed", textAlignment: "center"},
                    {accessor: "firstSeenDisplay", title: "First viewed", textAlignment: "center", width: "175px"},
                    {accessor: "lastSeenDisplay", title: "Last viewed", textAlignment: "center", width: "175px"},
                  ]}
                  records={historyVideosDisplay}
              />
            </Container>
          </Center>
        </div>
      </MantineProvider>
  )
}