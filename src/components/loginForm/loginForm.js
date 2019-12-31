import React, { useState } from "react"
import styled from "styled-components"

import { useMutation } from "urql"
import gql from "graphql-tag"

import { setAuth, getAuth } from "../../auth"
import sanitizeErrors from "./sanitizeErrors"
import Button from "../button"
import { useStore } from "../../state/store"

import { loginMutation } from "../../auth/mutationLoginUser"

export default () => {
  // dispatch to manage login state & store user info
  const [, dispatch] = useStore()

  // 'values' for controlling state of inputs
  const [values, setValues] = useState({ username: "", password: "" })

  // 'formError' for managing the forms error messages
  const [formError, setFormError] = useState("")

  // 'useMutation' from 'urql' - react hooks implementation
  const [res, executeLogin] = useMutation(loginMutation)
  // console.log({ ...res })

  // control the form input values with state
  const handleChange = ({ target: { name, value } }) => {
    setValues({ ...values, [name]: value })
  }

  const handleSubmit = e => {
    // prevent default form submission
    e.preventDefault()
    setFormError("")

    const { username, password } = values

    // prevent request with empty username or password
    if (username === "" || password === "") {
      setFormError("Please enter a username and password")
      return
    }

    // execute login mutation with the input values from the state
    executeLogin({ username, password })
      .then(response => {
        // console.log("then", response)
        const { error, data } = response

        if (error?.graphQLErrors) {
          // handle form errors
          error.graphQLErrors.map(err =>
            setFormError(sanitizeErrors(err.message))
          )
          return
        }

        if (data && data.login) {
          // store the auth/refresh tokens
          setAuth(data)

          // store user info in context store
          dispatch({ type: "SET_USER_INFO", payload: data.login.user })

          // update logged in state
          dispatch({ type: "SET_LOGGED_IN", payload: true })
        }
      })
      .catch(error => {
        console.log({ error })
        setFormError(
          "Something went wrong. Please try again later or contact support."
        )
      })
  }

  return (
    <Container>
      {formError && <ErrorMessage>{formError}</ErrorMessage>}
      <form onSubmit={handleSubmit} id="loginForm">
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          name="username"
          id="username"
          onChange={handleChange}
          value={values.username}
        />

        <label htmlFor="password">Password: </label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={handleChange}
          value={values.password}
        />
      </form>

      <Button
        loading={res.fetching}
        variant="action"
        type="submit"
        form="loginForm"
        value="Log in"
      >
        Log in
      </Button>
    </Container>
  )
}

const Container = styled.div``

const ErrorMessage = styled.p``
