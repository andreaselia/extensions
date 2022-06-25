import {
  Form,
  ActionPanel,
  Action,
  showToast,
  Toast,
  LocalStorage,
  open,
  Icon,
  List,
  confirmAlert,
} from "@raycast/api";
import axios from "axios";
import { useEffect, useState } from "react";
import GetRoomStorage from "./get-room-storage";
import { getTokenFromSecret } from "./utils";

interface Room {
  type: string;
  id: string;
  last_connection_at: string;
  created_at: string;
}

export default function Command() {
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([] as Room[]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getTokenFromSecret();

    (async () => {
      const jwt = await LocalStorage.getItem<string>("liveblocks-jwt");

      const toast = await showToast({
        style: Toast.Style.Animated,
        title: "Retrieving rooms...",
      });

      try {
        const { data } = await axios.get(`https://liveblocks.net/api/v1/rooms?limit=20&page=${page}`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });

        toast.style = Toast.Style.Success;
        toast.title = "Rooms retrieved successfully";

        setRooms(data.data);
      } catch (e) {
        toast.style = Toast.Style.Failure;
        toast.title = "Unable to retrieve rooms";
      }

      setLoading(false);
    })();
  }, []);

  return (
    <List isLoading={loading}>
      {rooms.map((room: Room, index: number) => (
        <List.Item
          key={index}
          title={room.id}
          actions={
            <ActionPanel title="Room Options">
              <Action.Push title="Get Room Storage" icon={Icon.List} target={<GetRoomStorage roomId={room.id} />} />
              <Action
                title="Delete Room Storage"
                icon={Icon.Trash}
                onAction={async () => {
                  if (
                    await confirmAlert({ title: `Are you sure you you want to delete the storage for ${room.id}?` })
                  ) {
                    const jwt = await LocalStorage.getItem<string>("liveblocks-jwt");

                    const toast = await showToast({
                      style: Toast.Style.Animated,
                      title: "Deleting the room...",
                    });

                    try {
                      await axios.delete(
                        `https://liveblocks.net/api/v1/room/${encodeURIComponent(values.roomId)}/storage`,
                        {
                          headers: { Authorization: `Bearer ${jwt}` },
                        }
                      );

                      toast.style = Toast.Style.Success;
                      toast.title = "Room deleted successfully";
                    } catch (e) {
                      toast.style = Toast.Style.Failure;
                      toast.title = "Unable to delete the room";
                    }
                  }
                }}
                shortcut={{ modifiers: ["cmd"], key: "delete" }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
