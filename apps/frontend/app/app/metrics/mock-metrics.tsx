export const mockModelsResponse = {
  data: {
    models: {
      edges: [
        { node: { name: "BeastStatus", namespace: "tamagotchi" } },
        { node: { name: "Beast", namespace: "tamagotchi" } },
        { node: { name: "Food", namespace: "tamagotchi" } },
        { node: { name: "Player", namespace: "tamagotchi" } },
      ],
    },
    tamagotchiPlayerModels: { totalCount: 88 },
    tamagotchiBeastModels: { totalCount: 112 },
    tamagotchiFoodModels: { totalCount: 1168 },
    tamagotchiBeastStatusModels: { totalCount: 112 },
  },
}

export const mockTransactionsResponse = {
  data: {
    transactions: {
      edges: [
        { node: { id: "2023-01-xyz", calldata: new Array(320).fill("0x0") } },
        { node: { id: "2023-02-xyz", calldata: new Array(350).fill("0x0") } },
        { node: { id: "2023-03-xyz", calldata: new Array(410).fill("0x0") } },
        { node: { id: "2023-04-xyz", calldata: new Array(490).fill("0x0") } },
        { node: { id: "2023-05-xyz", calldata: new Array(550).fill("0x0") } },
        { node: { id: "2023-06-xyz", calldata: new Array(620).fill("0x0") } },
        { node: { id: "2023-07-xyz", calldata: new Array(690).fill("0x0") } },
        { node: { id: "2023-08-xyz", calldata: new Array(820).fill("0x0") } },
        { node: { id: "2023-09-xyz", calldata: new Array(635).fill("0x0") } },
        { node: { id: "2023-10-xyz", calldata: new Array(580).fill("0x0") } },
        { node: { id: "2023-11-xyz", calldata: new Array(510).fill("0x0") } },
        { node: { id: "2023-12-xyz", calldata: new Array(635).fill("0x0") } },
      ],
    },
  },
}
