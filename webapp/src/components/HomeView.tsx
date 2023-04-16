import { Container } from "@mui/material"
import { useSession } from "@inrupt/solid-ui-react";
import { useTranslation } from "react-i18next";

const HomeView = () => {
    const { session } = useSession();
    const { t } = useTranslation("translation");    

    return (
        <Container sx={{ color: 'white', textAlign: 'center' }}>
            <div>
                <h1>{t("HomeView.welcome")}{session.info.isLoggedIn && `, ${session.info.webId?.substring(8).split('.')[0]}`}!</h1>
            </div>
        </Container>
    );
}

export default HomeView;
