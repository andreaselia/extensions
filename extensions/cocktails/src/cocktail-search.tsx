import { Action, ActionPanel, Detail, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { useState } from "react";

interface Drinks {
  drinks: Drink[];
}

interface Drink {
  idDrink: string;
  strDrink: string;
  strDrinkAlternate: string | null;
  strInstructions: string | null;
  strImageSource: string | null;
  strDrinkThumb: string | null;
  strGlass: string | null;
  strAlcoholic: string | null;
}

export default function Command() {
  const [state, setState] = useState({ searchText: "", letter: "a" });
  const { isLoading, data } = useFetch<Drinks>(
    state.searchText.length > 0
      ? `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${state.searchText}`
      : `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${state.letter}`,
    {
      keepPreviousData: false,
      execute: true,
      headers: {
        Accept: "application/json",
      },
    }
  );

  const onLetterChanged = (newValue: string) => {
    setState((previous) => ({ ...previous, letter: newValue }));
  };

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={(newValue) => setState((previous) => ({ ...previous, searchText: newValue }))}
      searchText={state.searchText}
      throttle
      searchBarAccessory={<CocktailSearchDefaultDropdown onLetterChanged={onLetterChanged} />}

    >
      {data &&
        data.drinks?.map((drink) => {
          return (
            <List.Item
              key={drink.idDrink}
              title={drink.strDrink}
              actions={
                <ActionPanel>
                  <Action.Push title="Show Drink" target={<DrinkView drink={drink} />} />
                </ActionPanel>
              }
              accessories={[{ text: drink.strGlass }, { text: drink.strAlcoholic }]}
            ></List.Item>
          );
        })}
    </List>
  );
}

function CocktailSearchDefaultDropdown(props: { onLetterChanged: (newValue: string) => void }) {
  const { onLetterChanged } = props;

  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  return (
    <List.Dropdown
      tooltip="Select Drink Type"
      storeValue={true}
      onChange={(newValue) => {
        onLetterChanged(newValue);
      }}
    >
      <List.Dropdown.Section title="Alcoholic Beverages">
        {letters.map((letter: string) => (
          <List.Dropdown.Item key={letter} title={letter.toUpperCase()} value={letter} />
        ))}
      </List.Dropdown.Section>
    </List.Dropdown>
  );
}

function DrinkView(props: { drink: Drink }) {
  const { drink } = props;

  const ingredients = Object.keys(drink).filter((key) => key.startsWith('strIngredient'))
    .map((key) => drink[key as keyof Drink])
    .filter((value) => value !== null);

  const markdown = `
![Illustration](${drink.strDrinkThumb})

## Instructions
${drink.strInstructions}

## Ingredients
${ingredients.map((ingredient) => `- ${ingredient}`)}
`;
  return (
    <Detail
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.TagList title={drink.strDrink}>
            <Detail.Metadata.TagList.Item text={drink.strAlcoholic} />
            <Detail.Metadata.TagList.Item text={drink.strGlass} />
          </Detail.Metadata.TagList>
          <Detail.Metadata.TagList title="Glass">
            <Detail.Metadata.TagList.Item text={drink.strGlass} />
          </Detail.Metadata.TagList>
        </Detail.Metadata>
      }
      markdown={markdown}
    />
  );
}
