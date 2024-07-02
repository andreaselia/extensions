import { ActionPanel, Action, showToast, Toast, open, Detail } from "@raycast/api";
import { useState } from "react";
import { getActiveUsers } from "../api";

interface CommandForm {
  roomId: string;
}

export default function Command() {
  const [output, setOutput] = useState("");

  async function handleSubmit(values: CommandForm) {
    if (values.roomId == "") {
      showToast(Toast.Style.Failure, "Error", "Room ID is required");
      return;
    }

    const toast = await showToast({
      style: Toast.Style.Animated,
      title: "Retrieving room storage...",
    });

    try {
      const { data } = await getActiveUsers(values.roomId);

      toast.style = Toast.Style.Success;
      toast.title = "Active users retrieved successfully";
      toast.primaryAction = {
        title: "Open in Dashboard",
        onAction: (toast) => {
          open(`https://liveblocks.io/dashboard/rooms/${encodeURIComponent(values.roomId)}`);
          toast.hide();
        },
      };

      setOutput(JSON.stringify(data));
    } catch (e) {
      toast.style = Toast.Style.Failure;
      toast.title = "Unable to retrieve room storage";
    }
  }

  return (
    <Detail
      markdown="Active Users"
      actions={
        <ActionPanel>
          <Action title="Back" onAction={() => console.log("todo")} />
        </ActionPanel>
      }
    />
  );
}
