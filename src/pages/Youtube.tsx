import React, {useEffect} from "react";
import {Center, Container, Flex, ScrollArea, Space, Table, Text, useMantineTheme} from "@mantine/core";
import {Dropzone} from "@mantine/dropzone";
import {IconFileSettings} from "@tabler/icons-react";

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
  lastSeenShort: string;
}

interface Video {
  title: string;
  link: string;
  channel: string;
  channelURL: string;
  timeSeen: number;
  firstSeen: Date;
  firstSeenDisplay: string;
  lastSeen: Date;
  lastSeenShort: string;
}

export default function Youtube(props: {
  onData: (str: string) => void;
}) {
  props.onData("Youtube");

  const batchSize = 25;
  const theme = useMantineTheme();

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
                item.lastSeenShort = timeSeen.toLocaleDateString();
              } else if (item.firstSeen > timeSeen) {
                item.firstSeen = timeSeen;
                item.firstSeenDisplay = timeSeen.toLocaleDateString();
              }
              videos[indexVideo] = item;
            } else {
              videos.push({
                title: title,
                link: titleURL,
                channel: channel,
                channelURL: channelURL,
                timeSeen: 1,
                firstSeen: timeSeen,
                firstSeenDisplay: timeSeen.toLocaleDateString(),
                lastSeen: timeSeen,
                lastSeenShort: timeSeen.toLocaleDateString(),
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
                item.lastSeenShort = video.lastSeen.toLocaleDateString();
              } else if (item.firstSeen > video.firstSeen) {
                item.firstSeen = video.firstSeen;
                item.firstSeenDisplay = video.firstSeen.toLocaleDateString();
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
                firstSeenDisplay: video.firstSeen.toLocaleDateString(),
                lastSeen: video.lastSeen,
                lastSeenShort: video.lastSeen.toLocaleDateString(),
              })
            }
          }
          setHistoryChannel(channels.sort((a: Channel, b: Channel) => b.timeSeen - a.timeSeen));
          setHistoryVideos(videos.sort((a: Video, b: Video) => b.timeSeen - a.timeSeen));
          setVideosSeen(videosSeen);
          setUniqueVideosSeen(uniqueVideosSeen);
          setChannelsSeen(channelsSeen);
        }
        setIsLoading(false);
      }, [historyRaw]
  )

  useEffect(() => {
    setHistoryChannelDisplay(historyChannel.slice(0, batchSize));
  }, [historyChannel])

  useEffect(() => {
    setHistoryVideosDisplay(historyVideos.slice(0, batchSize));
  }, [historyVideos])


  return (
      <Center style={{textAlign: "center"}}>
        <Container hidden={historyRaw.length !== 0}>
          <Dropzone loading={isLoading}
                    onDrop={(file) => {
                      setIsLoading(true);
                      handleDrop(file[0]);
                      // FIXME: fix isLoading
                    }}
                    style={{width: 600}}
                    radius={"lg"}
                    accept={["application/json"]}
                    maxFiles={1}
          >
            <Dropzone.Idle>
              <IconFileSettings size="75" stroke={1.5} color={theme.colors.dark[0]}/>
            </Dropzone.Idle>
            <Text mt={"sm"} size="xl" fw={500} inline color={theme.colors.dark[0]}>
              Drag your watch-history.json file here or click to select it
            </Text>
          </Dropzone>
        </Container>
        <Container hidden={historyRaw.length === 0}>
          <Flex justify={"space-evenly"}>
            <Flex direction={"row"}>
              <Text fz={"lg"}>Channels seen:&nbsp;</Text>
              <Text fz={"lg"} fw={800} color={theme.primaryColor}>{channelsSeen}</Text>
            </Flex>
            <Space w={"lg"}/>
            <Flex direction={"row"}>
              <Text fz={"lg"}>Videos seen:&nbsp;</Text>
              <Text fz={"lg"} fw={800} color={theme.primaryColor}>{videosSeen}</Text>
            </Flex>
            <Space w={"lg"}/>
            <Flex direction={"row"}>
              <Text fz={"lg"}> Unique videos seen:&nbsp;</Text>
              <Text fz={"lg"} fw={800} color={theme.primaryColor}>{uniqueVideosSeen}</Text>
            </Flex>
          </Flex>
          <Space h={"lg"}/>
          <ScrollArea h={500}>
            <Table highlightOnHover striped withBorder horizontalSpacing={"md"}>
              <thead>
              <tr>
                {/*TODO: fix thead when scrolling*/}
                {/*TODO: make header element clickable to sort the table */}
                {["Channel", "Videos seen", "Unique videos seen", "First seen", "Last seen"].map((header) => {
                  return <th style={{textAlign: "center"}}>{header}</th>
                })}
              </tr>
              </thead>
              <tbody>
              {historyChannelDisplay.map((row) => {
                return (
                    <tr>
                      <td><a style={{
                        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[0],
                        textDecoration: "none"
                      }} href={row.link}>
                        {row.channel}
                      </a></td>
                      <td>{row.timeSeen}</td>
                      <td>{row.timeUniqueSeen}</td>
                      <td>{row.firstSeenDisplay}</td>
                      <td>{row.lastSeenShort}</td>
                    </tr>
                )
              })}
              </tbody>
            </Table>
          </ScrollArea>
          <Space h={"lg"}/>
          <ScrollArea h={500}>
            <Table highlightOnHover striped withBorder horizontalSpacing={"md"}>
              <thead>
              <tr>
                {["Title", "Channel", "Time seen", "First seen", "Last seen"].map((header) => {
                  return <th style={{textAlign: "center"}}>{header}</th>
                })}
              </tr>
              </thead>
              <tbody>
              {historyVideosDisplay.map((row) => {
                return (
                    <tr>
                      <td><a href={row.link} style={{
                        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[0],
                        textDecoration: "none"
                      }}>
                        {row.title.length > 53 ? row.title.substring(0, 50) + "..." : row.title}
                      </a></td>
                      <td><a href={row.channelURL} style={{
                        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[0],
                        textDecoration: "none"
                      }}>
                        {row.channel.length > 30 ? row.channel.substring(0, 10) + "..." : row.channel}
                      </a></td>
                      <td>{row.timeSeen}</td>
                      <td>{row.firstSeenDisplay}</td>
                      <td>{row.lastSeenShort}</td>
                    </tr>
                )
              })}
              </tbody>
            </Table>
          </ScrollArea>
        </Container>
      </Center>
  )
}