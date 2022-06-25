import { showToast, Toast, LocalStorage, open, Detail } from "@raycast/api";
import axios from "axios";
import { useEffect, useState } from "react";

export default function GetRoomStorage({ roomId }: { roomId: string }): JSX.Element {
  const [output, setOutput] = useState("");

  useEffect(() => {
    (async () => {
      const jwt = await LocalStorage.getItem<string>("liveblocks-jwt");

      const toast = await showToast({
        style: Toast.Style.Animated,
        title: "Retrieving room storage...",
      });

      try {
        const { data } = await axios.get(
          `https://liveblocks.net/api/v1/room/${encodeURIComponent(roomId)}/storage/json`,
          {
            headers: { Authorization: `Bearer ${jwt}` },
          }
        );

        toast.style = Toast.Style.Success;
        toast.title = "Room storage retrieved successfully";
        toast.primaryAction = {
          title: "Open in Dashboard",
          onAction: (toast) => {
            open(`https://liveblocks.io/dashboard/rooms/${encodeURIComponent(roomId)}`);
            toast.hide();
          },
        };

        setOutput(JSON.stringify(data));
      } catch (e) {
        console.log(`https://liveblocks.net/api/v1/room/${encodeURIComponent(roomId)}/storage/json`);
        toast.style = Toast.Style.Failure;
        toast.title = "Unable to retrieve room storage";
      }
    })();
  }, []);

  return <Detail markdown={"```" + output + "```"} />;
}
