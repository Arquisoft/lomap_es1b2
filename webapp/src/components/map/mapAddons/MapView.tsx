import { v4 as uuid } from 'uuid';
import { Close } from '@mui/icons-material';
import NewUbicationForm from './NewUbicationForm';
import { useSession } from '@inrupt/solid-ui-react';
import { IPMarker } from "../../../shared/SharedTypes";
import DetailedUbicationView from './DetailedInfoWindow';
import { saveMarkers } from '../../../helpers/SolidHelper';
import { useState, useEffect, useContext, useRef } from 'react';
import { MarkerContext, Types } from '../../../context/MarkerContextProvider';
import {
    Box,
    Grid,
    Stack,
    Button,
    Dialog,
    Select,
    MenuItem,
    TextField,
    IconButton,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import { useNotifications } from 'reapop';
import { useTranslation } from 'react-i18next';
import LoMap from '../Map';

const MapView = () => {
    const { session } = useSession();
    const nextID = useRef<string>(uuid());
    const [globalLat, setGlobalLat] = useState<number>(0);
    const [globalLng, setGlobalLng] = useState<number>(0);
    const [globalName, setGlobalName] = useState<string>("");
    const [globalMode, setGlobalMode] = useState<string>("E");
    const [isFormOpened, setFormOpened] = useState<boolean>(false);
    const { state: markers, dispatch } = useContext(MarkerContext);
    const [globalAddress, setGlobalAddress] = useState<string>("");
    const [isFilterOpen, setFilterOpen] = useState<boolean>(false);
    const [globalFilterName, setGlobalFilterName] = useState<string>("");
    const [acceptedMarker, setAcceptedMarker] = useState<boolean>(false);
    const [globalDescription, setGlobalDescription] = useState<string>("");
    const [globalCategory, setGlobalCategory] = useState<string>("Museos");
    const [isDetailedIWOpen, setDetailedIWOpen] = useState<boolean>(false);
    const [isFriendsOn, setFriendsOn] = useState<boolean>(false);
    const [globalOwnr, setGlobalOwner] = useState<string>(session.info.webId?.substring(8).split('.')[0]!);
    const [globalFilterCategories, setGlobalFilterCategories] = useState([
        'Museos', 'Parques', 'Tiendas',
        'Edificios', 'Farmacias', 'Transporte',
        'Restaurantes', 'Entretenimiento'
    ]);
    const [menuOptions, setMenuOptions] = useState<{value:string, txt: string}[]>()
    
    const [markerShown, setMarkerShown] = useState<IPMarker>({
        id: "", owner: globalOwnr, date: new Date(), lat: 0, lng: 0, name: "Sin nombre", address: "Sin dirección",
        category: "Sin categoría", isPublic: false, description: "Sin descripción",
        ratings: [], comments: [], webId: ""
    });

    const { notify } = useNotifications();

    const { t } = useTranslation("translation");

    const addMarker = (marker: IPMarker) => {
        dispatch({ type: Types.ADD_MARKER, payload: { marker: marker } });
    };

    useEffect(() => {
        if (session.info.isLoggedIn) {
            console.log("guardo");
            saveMarkers(markers.filter((marker) => marker.webId === session.info.webId!),
                session.info.webId!);
        }        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [markers]);

    const handleCategories = (
        event: React.MouseEvent<HTMLElement>,
        newCategories: string[]
    ) => {
        setGlobalFilterCategories(newCategories);
    };

    const showLocationAdded = () => {
        notify(t("Notifications.okUbiAdd"), "success");
    }

    const showLocationDeleted = () => {
        notify(t("Notifications.okUbi"), "success");
    }

    session.onLogout(() => {
        setGlobalMode('E');
        setFormOpened(false);
        setDetailedIWOpen(false);
    });

    const changeFriendsMap = (value: string) => {
        if (value === 'E' || value === 'A')
            setFriendsOn(true);
        else
            setFriendsOn(false);
    }

    useEffect(() => {
        setDetailedIWOpen(false);
        setFormOpened(false);
    }, [globalMode])

    useEffect(() => {
        if (session.info.isLoggedIn){
            setGlobalMode('M')
            setMenuOptions([
                {value: 'M', txt: t("MapView.misubs")}, 
                {value: 'A', txt: t("MapView.friends")},
            ])
        }else {
            setMenuOptions([{value: 'E', txt: t("MapView.explora")}])
            setGlobalMode('E')
        }
    }, [session.info.isLoggedIn]);


    return (
        <Grid container sx={{ width: '100%', height: '100%' }}>
            <Grid item xs={12}>
                <Stack direction={'row'} alignItems={'center'}>
                <Select
                    value={globalMode}
                    onChange={(e) => {
                        setGlobalMode(e.target.value)
                        changeFriendsMap(e.target.value);
                    }}
                    sx={{ width: '15em', height: '3em', bgcolor: 'white', margin: '1em', marginLeft: '2%' }}
                >
                    {menuOptions?.map(({value, txt}) => (
                        <MenuItem key={value} value={value} >{txt}</MenuItem>
                    ))
                    }
                </Select>
                    <Button sx={{ fontSize: 'large', color:'lightblue', border: '2px solid', borderColor: 'white' }} variant="outlined" color="primary" onClick={() => setFilterOpen(true)}>
                        {t("MapView.filtros")}
                    </Button>
                    <Dialog onClose={() => setFilterOpen(false)} open={isFilterOpen}>
                        <Stack direction='column' padding={'1em'}>
                            <Stack direction='row'>
                                <h1 style={{ margin: '0' }}>{t("MapView.filtra")}</h1>
                                <IconButton sx={{ marginLeft: 'auto', marginRight: '0em' }} onClick={async () => setFilterOpen(false)}><Close /></IconButton>
                            </Stack>
                            <h2>{t("MapView.name")}</h2>
                            <TextField value={globalFilterName} onChange={(e) => setGlobalFilterName(e.target.value as string)}></TextField>
                            <h2>{t("MapView.categoria")}</h2>
                            <ToggleButtonGroup
                                onChange={handleCategories}
                                value={globalFilterCategories}
                                aria-label="Categorías seleccionadas"
                                sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <ToggleButton sx={{ flex: '1' }} value="Museos" aria-label="museos">{t("NewUbication.museos")}</ToggleButton>
                                <ToggleButton sx={{ flex: '1' }} value="Parques" aria-label="parques">{t("NewUbication.parques")}</ToggleButton>
                                <ToggleButton sx={{ flex: '1' }} value="Tiendas" aria-label="tiendas">{t("NewUbication.tiendas")}</ToggleButton>
                                <ToggleButton sx={{ flex: '1' }} value="Edificios" aria-label="edificios">{t("NewUbication.edificios")}</ToggleButton>
                                <ToggleButton sx={{ flex: '1' }} value="Farmacias" aria-label="farmacias">{t("NewUbication.farmacias")}</ToggleButton>
                                <ToggleButton sx={{ flex: '1' }} value="Transporte" aria-label="transporte">{t("NewUbication.transporte")}</ToggleButton>
                                <ToggleButton sx={{ flex: '1' }} value="Restaurantes" aria-label="restaurantes">{t("NewUbication.restaurantes")}</ToggleButton>
                                <ToggleButton sx={{ flex: '1' }} value="Entretenimiento" aria-label="entretenimiento">{t("NewUbication.entretenimiento")}</ToggleButton>
                            </ToggleButtonGroup>
                        </Stack>
                    </Dialog>
                    <Box sx={{ flexGrow: 2 }}></Box>
                    {(globalMode==='M' && session.info.isLoggedIn) &&
                        <Button
                            variant="outlined"
                            sx={{
                                width: '15em',
                                margin: '1em',
                                fontSize: 'large',
                                display: isFormOpened ? 'none' : '',
                                marginRight: '3%', 
                                color:'lightblue',
                                border: '2px solid'
                            }}
                            onClick={async () => setFormOpened(!isFormOpened)}
                        >{t("MapView.newub")}</Button>
                    }
                </Stack>
            </Grid>
            <Grid item xs={isDetailedIWOpen ? 3 : 0}>
                <DetailedUbicationView
                    markerShown={markerShown}
                    setMarkerShown={setMarkerShown}
                    isDetailedIWOpen={isDetailedIWOpen}
                    setDetailedIWOpen={setDetailedIWOpen}
                />
            </Grid>
            <Grid item xs={12 - (isFormOpened ? 3 : 0) - (isDetailedIWOpen ? 3 : 0)} sx={{ width: '100%', height: '100%' }}>
                
                    <LoMap
                        nextID={nextID}
                        mapTypeControl={true}
                        globalLat={globalLat}
                        globalLng={globalLng}
                        globalMode={globalMode}
                        globalName={globalName}
                        setGlobalLat={setGlobalLat}
                        setGlobalLng={setGlobalLng}
                        globalAddress={globalAddress}
                        acceptedMarker={acceptedMarker}
                        globalCategory={globalCategory}
                        setMarkerShown={setMarkerShown}
                        setGlobalAddress={setGlobalAddress}
                        globalFilterName={globalFilterName}
                        setAcceptedMarker={setAcceptedMarker}
                        globalDescription={globalDescription}
                        setDetailedIWOpen={setDetailedIWOpen}
                        mapType={google.maps.MapTypeId.ROADMAP}
                        globalFilterCategories={globalFilterCategories}
                        friendsMap={isFriendsOn}
                        setFriendsMap={setFriendsOn}
                        isNewUbiOpen={isFormOpened}
                        notify={showLocationDeleted}
                    />
                
            </Grid>
            {
                isFormOpened && <Grid item xs={3}>
                <NewUbicationForm
                    nextID={nextID}
                    globalLat={globalLat}
                    globalLng={globalLng}
                    globalOwnr={globalOwnr}
                    setGlobalOwner={setGlobalOwner}
                    addMarker={addMarker}
                    globalName={globalName}
                    formOpened={isFormOpened}
                    setGlobalLat={setGlobalLat}
                    setGlobalLng={setGlobalLng}
                    setGlobalName={setGlobalName}
                    setFormOpened={setFormOpened}
                    globalAddress={globalAddress}
                    globalCategory={globalCategory}
                    globalDescription={globalDescription}
                    setGlobalCategory={setGlobalCategory}
                    setAcceptedMarker={setAcceptedMarker}
                    setGlobalDescription={setGlobalDescription}
                    notify={showLocationAdded}
                />
            </Grid>
            }
            
        </Grid>
    );
}

export default MapView;
