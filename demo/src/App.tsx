import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Overview } from "./pages/Overview";
import { HuntExecutions } from "./pages/HuntExecutions";
import { IocFeed } from "./pages/IocFeed";
import { EvidenceDecisions } from "./pages/EvidenceDecisions";
import { Notifications } from "./pages/Notifications";
import { AuditTrail } from "./pages/AuditTrail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Overview />} />
          <Route path="hunts" element={<HuntExecutions />} />
          <Route path="iocs" element={<IocFeed />} />
          <Route path="evidence" element={<EvidenceDecisions />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="audit" element={<AuditTrail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
