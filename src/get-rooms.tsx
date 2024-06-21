import { ActionPanel, Action, Icon, List } from "@raycast/api";
import { RoomData } from "@liveblocks/node";
import { useEffect, useState } from "react";
import { getRooms } from "./api";

export default function Command() {
  const [rooms, setRooms] = useState<RoomData[]>([]);

  useEffect(() => {
    async function fetchRooms() {
      const rooms = await getRooms();

      setRooms(rooms.data);
    }

    fetchRooms();
  }, []);

  console.log(rooms);

  return (
    <List isLoading={true} searchBarPlaceholder="Search for a room" onSearchTextChange={() => {}}>
        <List.Item
            title="Room 1"
            subtitle="Room ID: 1"
            actions={
            <ActionPanel>
                <Action title="Get Room Storage" icon={Icon.Pencil} onAction={() => {}} />
                <Action title="Initialize Room Storage" icon={Icon.Plus} onAction={() => {}} />
                <Action title="Delete Room Storage" icon={Icon.Trash} onAction={() => {}} />
            </ActionPanel>
            }
        />
    </List>
  );
}
