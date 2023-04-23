import React, {useEffect} from "react";
import MainHeader from "../components/MainHeader";
import {Center, Container, MantineProvider, Space, Text} from "@mantine/core";
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
  timeViewed: number;
  timeUniqueViewed: number;
  firstViewed: Date;
  firstViewedDisplay: string;
  lastViewed: Date;
  lastViewedDisplay: string;
}

interface Video {
  title: string;
  link: string;
  channel: string;
  timeViewed: number;
  firstViewed: Date;
  firstViewedDisplay: string;
  lastViewed: Date;
  lastViewedDisplay: string;
}

export default function Youtube() {
  const batchSize = 25;

  const [isLoading, setIsLoading] = React.useState(false);
  const [historyRaw, setHistoryRaw] = React.useState<HistoryJson[]>([]);
  const [historyChannel, setHistoryChannel] = React.useState<Channel[]>([]);
  const [historyChannelDisplay, setHistoryChannelDisplay] = React.useState<Channel[]>([]);
  const [historyVideos, setHistoryVideos] = React.useState<Video[]>([]);
  const [historyVideosDisplay, setHistoryVideosDisplay] = React.useState<Video[]>([]);
  /*const [sortStatusVideos, setSortStatusVideos] = React.useState<DataTableSortStatus>({
    columnAccessor: 'timeViewed',
    direction: 'asc'
  });
  const [sortStatusChannel, setSortStatusChannel] = React.useState<DataTableSortStatus>({
    columnAccessor: 'timeViewed',
    direction: 'asc'
  });*/

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
            const title =  video.title.replace("Vous avez regardé ", "");
            if (title === "Vous avez regardé une vidéo qui a été supprimée" || !video.subtitles) continue;
            const titleURL = video.titleUrl;
            const channel = video.subtitles[0].name;
            const channelURL = video.subtitles[0].url;
            const timeViewed = new Date(video.time);

            /*const indexChannel = channels.findIndex((item) => item.channel === channel);
            if (indexChannel !== -1) {
              const item = channels[indexChannel];
              item.timeViewed++;
              if (item.lastViewed < timeViewed) {
                item.lastViewed = timeViewed;
              } else if (item.firstViewed > timeViewed) {
                item.firstViewed = timeViewed;
              }
              channels[indexChannel] = item;
            } else {
              channels.push({
                channel: channel,
                link: channelURL,
                timeViewed: 1,
                firstViewed: timeViewed,
                firstViewedDisplay: timeViewed.toLocaleString(),
                lastViewed: timeViewed,
                lastViewedDisplay: timeViewed.toLocaleString()
              })
            }*/

            const indexVideo = videos.findIndex((item) => item.title === title);
            if (indexVideo !== -1) {
              const item = videos[indexVideo];
              item.timeViewed++;
              if (item.lastViewed < timeViewed) {
                item.lastViewed = timeViewed;
                item.lastViewedDisplay = timeViewed.toLocaleString();
              } else if (item.firstViewed > timeViewed) {
                item.firstViewed = timeViewed;
                item.firstViewedDisplay = timeViewed.toLocaleString();
              }
              videos[indexVideo] = item;
            } else {
              videos.push({
                title: title,
                link: titleURL,
                channel: channel,
                timeViewed: 1,
                firstViewed: timeViewed,
                firstViewedDisplay: timeViewed.toLocaleString(),
                lastViewed: timeViewed,
                lastViewedDisplay: timeViewed.toLocaleString()
              })
            }
          }

          for (const video of videos) {
            const indexChannel = channels.findIndex((item) => item.channel === video.channel);
            if (indexChannel !== -1) {
              const item = channels[indexChannel];
              item.timeViewed += video.timeViewed;
              item.timeUniqueViewed++;
              if (item.lastViewed < video.lastViewed) {
                item.lastViewed = video.lastViewed;
                item.lastViewedDisplay = video.lastViewed.toLocaleString();
              } else if (item.firstViewed > video.firstViewed) {
                item.firstViewed = video.firstViewed;
                item.firstViewedDisplay = video.firstViewed.toLocaleString();
              }
              channels[indexChannel] = item;
            } else {
              channels.push({
                channel: video.channel,
                link: video.link,
                timeViewed: video.timeViewed,
                timeUniqueViewed: 1,
                firstViewed: video.firstViewed,
                firstViewedDisplay: video.firstViewed.toLocaleString(),
                lastViewed: video.lastViewed,
                lastViewedDisplay: video.lastViewed.toLocaleString()
              })
            }
          }
          setHistoryChannel(channels.sort((a: Channel, b: Channel) => b.timeViewed - a.timeViewed));
          console.log("channels: ", channels.length);
          setHistoryVideos(videos.sort((a: Video, b: Video) => b.timeViewed - a.timeViewed));
          console.log("videos: ", videos.length);
          setHistoryChannelDisplay(channels.slice(0, batchSize));
          setHistoryVideosDisplay(videos.slice(0, batchSize));
        }
      }, [historyRaw]
  )

  /*  useEffect(() => {
      const data = sortBy(historyVideos, sortStatusVideos.columnAccessor) as Video[];
      setHistoryVideos(sortStatusVideos.direction === 'desc' ? data.reverse() : data);
    }, [sortStatusVideos]);
  
    useEffect(() => {
      const data = sortBy(historyChannel, sortStatusChannel.columnAccessor) as Channel[];
      setHistoryChannel(sortStatusChannel.direction === 'desc' ? data.reverse() : data);
    }, [sortStatusChannel]);*/

  return (
      <MantineProvider
          theme={{
            colorScheme: "dark",
            primaryColor: "red"
          }}
      >
        <div className="App" style={{height: "100vh", backgroundColor: useMantineTheme().colors.dark[4]}}>
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
                  Drag your history.json file here or click to select it
                </Text>
              </Dropzone>
            </Container>
            <Container hidden={historyRaw.length === 0}>
              <DataTable
                  borderRadius={"sm"}
                  striped
                  highlightOnHover
                  withBorder
                  height={500}
                  columns={[
                    {accessor: "channel", title: "Channel", textAlignment: "center"},
                    {accessor: "timeViewed", title: "Videos viewed", textAlignment: "center"},
                    {accessor: "timeUniqueViewed", title: "Unique videos viewed", textAlignment: "center"},
                    {accessor: "firstViewedDisplay", title: "First viewed", textAlignment: "center", width: "175px"},
                    {accessor: "lastViewedDisplay", title: "Last viewed", textAlignment: "center", width: "175px"},
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
                    {accessor: "timeViewed", title: "Time viewed", textAlignment: "center"},
                    {accessor: "firstViewedDisplay", title: "First viewed", textAlignment: "center", width: "175px"},
                    {accessor: "lastViewedDisplay", title: "Last viewed", textAlignment: "center", width: "175px"},
                  ]}
                  records={historyVideosDisplay}
              />
            </Container>
          </Center>
        </div>
      </MantineProvider>
  )
}