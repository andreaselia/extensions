import { ActionPanel, Action, Icon, List } from "@raycast/api";
import { RoomData } from "@liveblocks/node";
import { useEffect, useState } from "react";
import { getRooms } from "./api";

export default function Command() {
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
              <Action title="Get Room Storage" icon={Icon.Pencil} onAction={() => {}} />
              <Action title="Initialize Room Storage" icon={Icon.Plus} onAction={() => {}} />
              <Action title="Delete Room Storage" icon={Icon.Trash} onAction={() => {}} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
