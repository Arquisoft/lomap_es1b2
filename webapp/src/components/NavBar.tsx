import { useState} from 'react';
import { Link } from "react-router-dom";
import LoginForm from './login/LoginForm';
import { Stack, Box, Button } from '@mui/material';
import { useSession, LogoutButton } from '@inrupt/solid-ui-react';
import { useTranslation } from 'react-i18next';
import { height } from 'rdf-namespaces/dist/as';

export const NavBar = () => {
    const UK_URL = "/uk-flag.png";
    const ES_URL = "/es-flag.png";

    const { session } = useSession();
    const [open, setOpen] = useState(false);
    const [icon, setIcon] = useState<string>(UK_URL);

    const { t, i18n } = useTranslation("translation");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const changeLanguage = () => {
        if (i18n.language == "en") {
            i18n.changeLanguage("es");
            setIcon(UK_URL);
        }           
        else {
            i18n.changeLanguage("en");
            setIcon(ES_URL);
        } 
    }

    return (
        <nav>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 1, sm: 2, md: 4 }}
                alignItems='center'
                justifyContent='left'
            >
                <Link to="/"><img src="/logo-no-background.png" className="App-logo" alt="logo" height="60" /></Link>
                <Link to="/map">{t("NavBar.map" as const)}</Link>
                { session.info.isLoggedIn ? 
                    <>
                        <Link to="/ubications">{t("NavBar.ubic")}</Link>
                        <Link to="/friends">{t("NavBar.friends")}</Link>
                        <Link to="/aboutus">{t("NavBar.about" as const)}</Link>

                        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems='center' sx={{ flexGrow: '2' }} justifyContent='flex-end' spacing={{ xs: 1, sm: 2, md: 4 }}>
                            <Box component="p" color={'white'}>{session.info.webId?.substring(8).split('.')[0]}</Box>
                            <LogoutButton>
                                <Button variant="contained" sx={{ margin: "1em", marginLeft: "0em" }}>
                                    {t("NavBar.close")}
                                </Button>
                            </LogoutButton>
                        </Stack>
                    </>
                    : <Stack direction={{ xs: 'column', sm: 'row' }} alignItems='center' sx={{ flexGrow: '2' }} justifyContent='flex-end' spacing={{ xs: 1, sm: 2, md: 4 }}>
                        <Button variant="contained" onClick={handleClickOpen} sx={{ margin: "1em" }}>
                            {t("NavBar.open")}
                        </Button>
                        <LoginForm
                            open={open}
                            onClose={handleClose}
                        />
                    </Stack>}
                    <Button onClick={changeLanguage} style={{marginRight:"2.5%", height:"40"}}>
                        <img src={icon} height="40" alt="language" />
                    </Button>                    
            </Stack>
        </nav>
    )
}
