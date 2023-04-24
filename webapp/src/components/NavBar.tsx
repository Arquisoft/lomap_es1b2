import { useState} from 'react';
import { Link } from "react-router-dom";
import LoginForm from './login/LoginForm';
import { Stack, Box, Button, Select, MenuItem } from '@mui/material';
import { useSession, LogoutButton } from '@inrupt/solid-ui-react';
import { useTranslation } from 'react-i18next';
import { PersonData, findPersonData } from '../helpers/ProfileHelper';

export const NavBar = () => {
    const UK_URL = "/uk-flag.png";
    const ES_URL = "/es-flag.png";

    const DEFAULT_USERPIC = "/no-profile-pic.png";

    const { session } = useSession();
    const [open, setOpen] = useState(false);
    const [icon, setIcon] = useState<string>(UK_URL);

    const { t, i18n } = useTranslation("translation");

    const [personData, setPersonData] = useState<PersonData>()

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    }

    function searchPersonData(webId: string|undefined) {
        // let name = session.info.webId?.substring(8).split('.')[0]
        if (webId) {
            findPersonData(webId)
              .then(personData => {
                setPersonData(personData)
            })
            .catch(error => {
                console.error("Error en findPersonData:", error);
            });
        }
    }

    function getImg() {
        if (personData){
            return personData.photo;
        } else {
            return DEFAULT_USERPIC;
        }
    }

    return (
        <nav>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 1, sm: 2, md: 0 }}
                alignItems='center'
                justifyContent='center'
                sx={{
                    display:"grid",
                    gridTemplateColumns: "1fr auto 1fr",
                    textAlign: "center"
                }}
            >
                <Box>
                    <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 1, sm: 2, md: 4 }}
                    alignItems='center'
                    justifyContent='left'
                    >
                        <Link to="/"><img src="/logo-no-background.png" className="App-logo" alt="logo" height="60" /></Link>
                        <Link to="/map">{t("NavBar.map" as const)}</Link>
                        {session.info.isLoggedIn ? <>
                            <Link to="/ubications">{t("NavBar.ubic")}</Link>
                            <Link to="/friends">{t("NavBar.friends")}</Link>
                        </> : <></> 
                        }
                        <Link to="/aboutus">{t("NavBar.about" as const)}</Link>
                    </Stack>
                </Box>

                <Box>
                    <Select value={i18n.language} onChange={(e) => changeLanguage(e.target.value)}
                            sx={{boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 } }}>
                            <MenuItem value={"en"}> <img src={UK_URL} height="35" alt="en_icon" /> </MenuItem>
                            <MenuItem value={"es"}> <img src={ES_URL} height="35" alt="es_icon" /> </MenuItem>
                    </Select>
                </Box>

                <Box>
                    {session.info.isLoggedIn ? <>
                        {searchPersonData(session.info.webId)}
                        <Stack 
                        direction={{ xs: 'column', sm: 'row' }} 
                        alignItems='center'
                        justifyContent='flex-end' 
                        spacing={{ xs: 1, sm: 2, md: 2 } }
                        margin="1em">

                            <Box component="p" color={'white'}>
                                {personData?.name}
                            </Box>
                            <a href={personData?.photo} target="_blank" rel="noopener noreferrer">
                                <img src={getImg()} alt="" className="profile-pic" />
                            </a>
                            <LogoutButton>
                                <Button variant="outlined" sx={{ margin: "1em", marginLeft: "0em", color:'lightblue', border: '2px solid' }}>
                                    {t("NavBar.close")}
                                </Button>
                            </LogoutButton>

                        </Stack>
                    </> : <>
                        <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        alignItems='center' 
                        sx={{ flexGrow: '2' }} 
                        justifyContent='flex-end' 
                        margin="1em"
                        spacing={{ xs: 1, sm: 2, md: 2 }}>
                            <img src={DEFAULT_USERPIC} alt="" className="profile-pic" />
                            <Button variant="outlined" onClick={handleClickOpen} sx={{ margin: "1em", color:'lightblue', border: '2px solid', marginRight: '3.5%' }}>
                            {t("NavBar.open")}
                        </Button>
                            <LoginForm
                                open={open}
                                onClose={handleClose}
                            />
                        </Stack>
                    </>}

                </Box>               
            </Stack>
        </nav>
    )
}
