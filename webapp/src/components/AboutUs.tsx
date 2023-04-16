import { Container } from "@mui/material"
import { useSession } from "@inrupt/solid-ui-react";
import { useTranslation } from "react-i18next";

const AboutUs = () => {

    const { t } = useTranslation("translation");

    return (
        <Container sx={{ color: 'white', textAlign: 'center' }}>
            <div>
                <h1>{t("AboutUs.about")}</h1>
            </div>
        </Container>
    );
}

export default AboutUs;