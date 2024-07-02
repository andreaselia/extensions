import { Form, ActionPanel, Action, showToast, Toast, popToRoot, Icon } from "@raycast/api";
import { deleteRoomStorage } from "../api";

interface CommandForm {
  roomId: string;
}

export default function Command() {
  async function handleSubmit(values: CommandForm) {
    if (values.roomId == "") {
      showToast(Toast.Style.Failure, "Error", "Room ID is required");
      return;
    }

    const toast = await showToast({
      style: Toast.Style.Animated,
      title: "Deleting the room...",
    });

    try {
      await deleteRoomStorage(values.roomId);

      toast.style = Toast.Style.Success;
      toast.title = "Room deleted successfully";

      popToRoot();
    } catch (e) {
      toast.style = Toast.Style.Failure;
      toast.title = "Unable to delete the room";
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Delete Room Storage" onSubmit={handleSubmit} icon={Icon.Trash} />
        </ActionPanel>
      }
    >
      <Form.TextField id="roomId" title="Room ID" placeholder="Enter room ID" />
    </Form>
  );
}
