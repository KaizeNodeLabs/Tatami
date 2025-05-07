import { gql } from "@apollo/client"

export const GET_BABY_BEASTS_PLAYERS = gql`
  query GetBabyBeastsPlayers {
    tamagotchiPlayerModels {
      edges {
        node {
          address
          current_beast_id
        }
      }
      totalCount
    }
  }
`

export const GET_PLAYERS_TOTAL_COUNT = gql`
  query GetPlayersTotalCount {
    tamagotchiPlayerModels {
      totalCount
    }
  }
`

export const GET_TRANSACTIONS_TOTAL_COUNT = gql`
  query GetTransactionsTotalCount {
    transactions {
      totalCount
    }
  }
`

export const GET_BEASTS_TOTAL_DATA = gql`
  query GetBeastsTotalData {
    tamagotchiBeastModels {
      edges {
        node {
          beast_id
          birth_date
          player
        }
      }
      totalCount
    }
  }
`

export const GET_BEASTS_TOTAL_COUNT = gql`
  query GetBeastsTotalCount {
    tamagotchiBeastModels {
      totalCount
    }
  }
`

export const GET_ENTITIES_TOTAL_COUNT = gql`
  query GetEntitiesTotalCount {
    entities {
      totalCount
    }
  }
`

export const GET_MODELS_TOTAL_COUNT = gql`
  query GetModelsTotalCount {
    entities {
      totalCount
    }
  }
`

export const GET_FOOD_TOTAL_COUNT = gql`
  query GetFoodTotalCount {
    tamagotchiFoodModels {
      edges {
        node {
          id
          player
        }
      }
      totalCount
    }
  }
`

export const GET_BEAST_STATUS_TOTAL_COUNT = gql`
  query GetBeastStatusTotalCount {
    tamagotchiBeastStatusModels {
      edges {
        node {
          clean_status
        }
      }
      totalCount
    }
  }
`

export const GET_ALL_MODELS_DATA = gql`
  query getModels {
    models {
      edges {
        node {
          name
          namespace
        }
      }
    }
  }
`

export const GET_TRANSACTIONS = gql`
  query getTransactions {
    transactions {
      edges {
        node {
          id
          transactionHash
          senderAddress
          calldata
        }
      }
      totalCount
    }
  }
`
