import { Route } from "react-router-dom";
import ProtectedRouter from "./ProtectedRouter/ProtectedRouter";

// Field Executive Web Imports
import FieldExecutiveLayout from "../MobileAppPages/Field-Executive-Web/Layout/FieldExecutiveLayout";
import FieldExecutiveDashboard from "../MobileAppPages/Field-Executive-Web/pages/Dashboard/Dashboard";
import FieldExecutiveLogin from "../MobileAppPages/Field-Executive-Web/pages/Login/Login";

/**
 * Field Executive Web Routes Only
 * Sirf Field-Executive-Web pages ke routes
 */
export const MobileAppsRoutes = () => {
    return (
        <>
            {/* Field Executive Web view Routes start */}

            <Route
                path="/fe-WebView/login"
                element={
                   
                        <FieldExecutiveLayout>
                            <FieldExecutiveLogin />
                        </FieldExecutiveLayout>
                 
                }
            />
            <Route
                path="/fe-WebView/dashboard"
                element={
                   
                        <FieldExecutiveLayout>
                            <FieldExecutiveDashboard />
                        </FieldExecutiveLayout>
                   
                }
            />

            {/* Field Executive Web view Routes end */}
        </>
    );
};

export default MobileAppsRoutes;
