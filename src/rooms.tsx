import { ActionPanel, Action, Icon, List, useNavigation } from "@raycast/api";
import { RoomData } from "@liveblocks/node";
import { useEffect, useState } from "react";
import { getRooms } from "./api";
import ActiveUsers from "./views/active-users";
import GetRoomStorage from "./views/get-room-storage";
import InitRoomStorage from "./views/init-room-storage";
import DeleteRoomStorage from "./views/delete-room-storage";

export default function Command() {
  const { push } = useNavigation();
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<RoomData[]>([]);

  const fetchRooms = async () => {
    const rooms = await getRooms();

    setRooms(rooms.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <List
      isLoading={loading}
      pagination={{
        pageSize: 10,
        hasMore: true,
        onLoadMore: () => console.log("Load more"),
      }}
    >
      {rooms.map((room, index) => (
        <List.Item
          key={index}
          title={room.id}
          actions={
            <ActionPanel>
              <Action title="Get Active Users" icon={Icon.TwoPeople} onAction={() => push(<ActiveUsers />)} />
              <Action title="Get Room Storage" icon={Icon.Pencil} onAction={() => push(<GetRoomStorage />)} />
              <Action title="Initialize Room Storage" icon={Icon.Plus} onAction={() => push(<InitRoomStorage />)} />
              {/* Maybe replace delete with a confirm dialog so it doesn't need a view? */}
              <Action title="Delete Room Storage" icon={Icon.Trash} onAction={() => push(<DeleteRoomStorage />)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
