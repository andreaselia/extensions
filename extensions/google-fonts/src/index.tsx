import { ActionPanel, Detail, List, Action, getPreferenceValues, Icon } from "@raycast/api";
import { useEffect, useState } from "react";
import axios from "axios";

interface Preferences {
  apiKey: string;
}

interface FontItem {
  family: string;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: object;
  category: string;
  kind: string;
}

interface State {
  isLoading: boolean;
  items: FontItem[];
  error?: any;
  sort: string;
}

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();
  const [state, setState] = useState<State>({
    items: [],
    isLoading: true,
    sort: "Popular",
  });

  useEffect(() => {
    async function fetchFonts() {
      const baseUrl = "https://www.googleapis.com/webfonts/v1/webfonts";

      await axios
        .get(`${baseUrl}?key=${preferences.apiKey}&sort=${state.sort}`, {
          headers: { Authorization: `Bearer ${preferences.apiKey}` },
        })
        .then((response) => {
          setState((previous) => ({ ...previous, items: response.data.items, isLoading: false }));
        })
        .catch((error) => {
          setState((previous) => ({
            ...previous,
            error: error instanceof Error ? error : new Error("Something went wrong"),
            isLoading: false,
            items: [],
          }));
        });
    }

    fetchFonts();
  }, [state.sort]);

  return (
    <List
      isLoading={state.isLoading}
      isShowingDetail={true}
      searchBarAccessory={
        <List.Dropdown
          tooltip="Select Font Sorting"
          storeValue={true}
          onChange={(newValue) => {
            setState((previous) => ({ ...previous, sort: newValue }));
          }}
        >
          <List.Dropdown.Section title="Sort By">
            {["Alpha", "Date", "Popularity", "Style", "Trending"].map((sorting: string, index: number) => (
              <List.Dropdown.Item key={index} title={sorting} value={sorting} />
            ))}
          </List.Dropdown.Section>
        </List.Dropdown>
      }
    >
      {state.items?.map((item: FontItem, index: number) => (
        <List.Item
          key={index}
          title={item.family}
          detail={<List.Item.Detail
            metadata={
              <List.Item.Detail.Metadata>
                <List.Item.Detail.Metadata.Label title="Family" text={item.family} />
                {/* <List.Item.Detail.Metadata.TagList title="Variants">
                  {item.variants.map((variant: string, index: number) => (
                    <Detail.Metadata.TagList.Item
                      key={index}
                      text={variant}
                      color={"#eed535"}
                    />
                  ))}
                </List.Item.Detail.Metadata.TagList> */}
                <List.Item.Detail.Metadata.Label title="Version" text={item.version} />
                <List.Item.Detail.Metadata.Label title="Last Modified" text={item.lastModified} />
                <List.Item.Detail.Metadata.Label title="Category" text={item.category} />
                <List.Item.Detail.Metadata.Label title="Kind" text={item.kind} />
                {/* <List.Item.Detail.Metadata.TagList title="Subsets">
                  {item.subsets.map((subset: string, index: number) => (
                    <Detail.Metadata.TagList.Item
                      key={index}
                      text={subset}
                      color={"#eed535"}
                    />
                  ))}
                </List.Item.Detail.Metadata.TagList> */}
                <List.Item.Detail.Metadata.Separator />
                <List.Item.Detail.Metadata.Label title="Font Files" text="" />
                {/* {Object.entries(item.files).map(([key, value], index: number) => (
                  <List.Item.Detail.Metadata.Link
                    key={index}
                    title=""
                    target={value}
                    text={key}
                  />
                ))} */}
              </List.Item.Detail.Metadata>
            }
          />}
        />
      ))}
    </List>
  );
}
