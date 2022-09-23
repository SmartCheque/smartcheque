
import { setMessage } from "../reducer/backend/messageSlice"
import { ActionReducerMapBuilder } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios"
import authHeader from "../services/auth-header"

export const addCaseWithPending = <BuilderType>(
  builder: ActionReducerMapBuilder<BuilderType>,
  item: any
) => {
  builder.addCase(item.fulfilled, (state: any) => {
    state.pending = false
  })
  builder.addCase(item.rejected, (state: any) => {
    state.pending = false
  })
  builder.addCase(item.pending, (state: any) => {
    state.pending = true
  })
}

export const handleError = (
  error: any,
  thunkAPI: any
) => {
  const message =
    (error.response &&
      error.response.data &&
      error.response.data.message) ||
    error.message ||
    error.toString()
  console.error(message)
  thunkAPI.dispatch(setMessage({ message }))
  return thunkAPI.rejectWithValue(message)
}

export const axiosThunk = <Type>(
  name: string,
  axiosURL: string,
) => {
  return createAsyncThunk(
    name,
    async (
      action: Type,
      thunkAPI
    ) => {
      try {
        const response = await axios.post(
          axiosURL,
          action,
          { headers: authHeader() },
        )
        console.log(axiosURL, action, response)
        setMessage({ message: response.data.message })
      } catch (error: any) {
        console.error(axiosURL, action, error)
        return handleError(error, thunkAPI)
      }
    }
  )
}

export const axiosThunkData = <Type>(
  name: string,
  axiosURL: string,
) => {
  return createAsyncThunk(
    name,
    async (
      action: Type,
      thunkAPI
    ) => {
      try {
        const response = await axios.post(
          axiosURL,
          action,
          { headers: authHeader() },
        )
        console.log(axiosURL, action, response)
        return response.data
      } catch (error: any) {
        console.error(axiosURL, action, error)
        return handleError(error, thunkAPI)
      }
    }
  )
}

export const axiosThunkBlob = (
  name: string,
  axiosURL: string,
) => {
  return createAsyncThunk(
    name,
    async (
      action: { fileName: string },
      thunkAPI
    ) => {
      try {
        const response = await axios.get(
          axiosURL + action.fileName,
          { headers: authHeader(), responseType: 'blob' },
        )
        const blob = new Blob(
          [response.data],
          { type: response.headers['content-type'] }
        )
        const objectURL = URL.createObjectURL(blob)
        return objectURL
      } catch (error: any) {
        console.error(axiosURL, action, error)
        return handleError(error, thunkAPI)
      }
    }
  )
}

export const axiosThunkImage = (
  name: string,
  axiosURL: string,
) => {
  return createAsyncThunk(
    name,
    async (
      action: { id: number, image: Blob },
      thunkAPI
    ) => {
      const formData = new FormData()
      formData.append("image", action.image)
      formData.append("id", action.id.toString())
      try {
        const response = await axios.post(
          axiosURL,
          formData,
          { headers: authHeader() },
        )
        return response.data
      } catch (error: any) {
        console.error(axiosURL, action, error)
        return handleError(error, thunkAPI)
      }
    }
  )
}
