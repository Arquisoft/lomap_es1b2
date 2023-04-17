import { Box, Container, Grid, Typography } from "@mui/material"
import { useTranslation } from "react-i18next";

const AboutUs = () => {
    const { t } = useTranslation("translation");
  
    return (
        <Container
        maxWidth="md"
        sx={{
          textAlign: "center",
          mt: 4,
          mb: 4,
          borderRadius: "8px",
          background: "linear-gradient(to top, #2C5364, #203A43, #0F2027)",
          color: "white"
        }}
        >
        <Box p={3}>
          <Typography variant="h3" sx={{ mb: 3 }}>
            {t("AboutUs.about")}
          </Typography>
          <Typography sx={{ color: "#AAA", mb: 3 }}>
            {t("AboutUs.description")}
          </Typography>
          <Grid container justifyContent="center" spacing={10}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h5">{t("AboutUs.team1.name")}</Typography>
              <Typography variant="body2" sx={{ color: "#AAA" }}>
                {t("AboutUs.team1.role")}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h5">{t("AboutUs.team2.name")}</Typography>
              <Typography variant="body2" sx={{ color: "#AAA" }}>
                {t("AboutUs.team2.role")}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    );
  };
  
  export default AboutUs;