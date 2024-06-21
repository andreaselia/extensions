import { Action, ActionPanel, Detail } from "@raycast/api";

export const ActiveUsers = () => {
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
};
