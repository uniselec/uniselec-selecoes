import React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import App from "./App"
import { store } from "./app/store"
import "./index.css"
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { BrowserRouter } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/pt-br";
import StagingGateClientOnly from "./StagingGateClientOnly";

const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)

  root.render(
    <StagingGateClientOnly>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            <App />
          </LocalizationProvider>
        </Provider>
      </BrowserRouter>
    </StagingGateClientOnly>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
