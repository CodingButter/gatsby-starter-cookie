import gql from "graphql-tag"

import { USER_FRAGMENT } from "../fragments"

export const VIEWER_QUERY = gql`
  ${USER_FRAGMENT}
  query ViewerQuery {
    viewer {
      ...UserFragment
    }
  }
`

export default VIEWER_QUERY
