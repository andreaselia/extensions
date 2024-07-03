import { ActionPanel, Action, Icon, List, useNavigation, confirmAlert } from "@raycast/api";
import { RoomData } from "@liveblocks/node";
import { useEffect, useState } from "react";

import { deleteRoomStorage, getRooms } from "./api";
import ActiveUsers from "./views/active-users";
import GetRoomStorage from "./views/get-room-storage";
import InitRoomStorage from "./views/init-room-storage";

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
              <Action title="Get Active Users" icon={Icon.TwoPeople} onAction={() => push(<ActiveUsers roomId={room.id} />)} />
              <Action title="Get Room Storage" icon={Icon.Pencil} onAction={() => push(<GetRoomStorage roomId={room.id} />)} />
              <Action title="Initialize Room Storage" icon={Icon.Plus} onAction={() => push(<InitRoomStorage roomId={room.id} />)} />
              <Action title="Delete Room Storage" icon={Icon.Trash} onAction={async () => {
                  if (await confirmAlert({ title: "Are you sure?" })) {
                    await deleteRoomStorage(room.id);

                    fetchRooms();
                  }
              }} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
