import React, { useState } from "react"
import styled, { css } from "styled-components"

import { useStore } from "../state/store"

import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown"

import { logoutUser, updateToken } from "./../auth"

import Button from "./button"

export default () => {
  const [open, setOpen] = useState(null)
  const [{ user }, dispatch] = useStore()

  const { username, avatar } = user || {}

  const onClick = () => {
    setOpen(!open)
  }

  return (
    <ProfileBar
      onClick={onClick}
      aria-controls="simple-menu"
      aria-haspopup="true"
    >
      {avatar?.url && <Avatar src={avatar.url} />}
      {username}

      <ArrowDropDownIcon />

      <Menu open={open}>
        <MenuItem onClick={() => updateToken("my-invalid-token")}>
          Spoof authToken
        </MenuItem>
        <MenuItem onClick={() => logoutUser(dispatch)}>Log out</MenuItem>
      </Menu>
    </ProfileBar>
  )
}

const MenuItem = styled.button`
  border-radius: 0;
  width: 100%;
`

const Menu = styled.div`
  width: 100%;
  display: flex;

  pointer-events: none;
  opacity: 0;
  position: absolute;
  top: 100%;
  right: 0%;
  ${({ open }) =>
    open &&
    css`
      pointer-events: all;
      opacity: 1;
    `}
`

const ProfileBar = styled.div`
  position: relative;
  svg {
    color: rgba(0, 0, 0, 0.5);
  }
  cursor: pointer;
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.1);
  &:hover {
    background: rgba(0, 0, 0, 0.15);
    svg {
      color: rgba(0, 0, 0, 0.8);
    }
  }
  padding: 10px 20px;
  display: flex;
  align-items: center;
`

const Avatar = styled.img`
  border-radius: 100%;
  height: 30px;
  width: 30px;
  margin-bottom: 0;
  margin-right: 15px;
`