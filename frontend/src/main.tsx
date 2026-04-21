// Author: g.olshansky (c) 2026

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { I18nProvider } from "./i18n";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <I18nProvider>
            <App />
        </I18nProvider>
    </StrictMode>
);
