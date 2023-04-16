import Map from '../Map';
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
    const [globalFilterCategories, setGlobalFilterCategories] = useState([
        'Museos', 'Parques', 'Tiendas',
        'Edificios', 'Farmacias', 'Transporte',
        'Restaurantes', 'Entretenimiento'
    ]);
    const [markerShown, setMarkerShown] = useState<IPMarker>({
        id: "", date: new Date(), lat: 0, lng: 0, name: "Sin nombre", address: "Sin dirección",
        category: "Sin categoría", isPublic: false, description: "Sin descripción",
        ratings: [], comments: [], webId: ""
    });
    const { notify } = useNotifications();

    const { t } = useTranslation("translation");

    const addMarker = (marker: IPMarker) => {
        dispatch({ type: Types.ADD_MARKER, payload: { marker: marker } });
    };

    useEffect(() => {
        document.body.style.overflow='hidden';
        if (session.info.isLoggedIn) {
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
        notify("Nueva localización añadida!");
    }

    const showLocationDeleted = () => {
        notify("Localización eliminada correctamente!");
    }

    session.onLogout(() => {
        setGlobalMode("E");
        setFormOpened(false);
        setDetailedIWOpen(false);
    });

    return (
        <Grid container sx={{ width: '100%', height: '100%' }}>
            <Grid item xs={12}>
                <Stack direction={'row'} alignItems={'center'}>
                    {session.info.isLoggedIn ?
                        <Select
                            value={globalMode}
                            onChange={(e) => setGlobalMode(e.target.value)}
                            sx={{ width: '15em', height: '3em', bgcolor: 'white', margin: '1em', marginLeft: '2%' }}
                        >
                            <MenuItem value={'E'}>{t("MapView.explora")}</MenuItem>
                            <MenuItem value={'M'}>{t("MapView.misubs")}</MenuItem>
                            <MenuItem value={'A'}>{t("MapView.friends")}</MenuItem>
                        </Select>
                        :
                        <Select
                            value={'E'}
                            sx={{ width: '15em', height: '3em', bgcolor: 'white', margin: '1em', marginLeft: '2%' }}
                        >
                            <MenuItem value={'E'}>{t("MapView.explora")}</MenuItem>
                        </Select>}
                    <Button sx={{ fontSize: 'large' }} variant="contained" onClick={() => setFilterOpen(true)}>
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
                                <ToggleButton sx={{ flex: '1' }} value="Museos" aria-label="museos">{t("NewUbication.museo")}</ToggleButton>
                                <ToggleButton sx={{ flex: '1' }} value="Parques" aria-label="parques">{t("NewUbication.parks")}</ToggleButton>
                                <ToggleButton sx={{ flex: '1' }} value="Tiendas" aria-label="tiendas">{t("NewUbication.shops")}</ToggleButton>
                                <ToggleButton sx={{ flex: '1' }} value="Edificios" aria-label="edificios">{t("NewUbication.build")}</ToggleButton>
                                <ToggleButton sx={{ flex: '1' }} value="Farmacias" aria-label="farmacias">{t("NewUbication.pharm")}</ToggleButton>
                                <ToggleButton sx={{ flex: '1' }} value="Transporte" aria-label="transporte">{t("NewUbication.transp")}</ToggleButton>
                                <ToggleButton sx={{ flex: '1' }} value="Restaurantes" aria-label="restaurantes">{t("NewUbication.rest")}</ToggleButton>
                                <ToggleButton sx={{ flex: '1' }} value="Entretenimiento" aria-label="entretenimiento">{t("NewUbication.entret")}</ToggleButton>
                            </ToggleButtonGroup>
                        </Stack>
                    </Dialog>
                    <Box sx={{ flexGrow: 2 }}></Box>
                    {session.info.isLoggedIn &&
                        <Button
                            variant="contained"
                            sx={{
                                width: '15em',
                                margin: '1em',
                                fontSize: 'large',
                                display: isFormOpened ? 'none' : '',
                                marginRight: '3%',
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
                <Map
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
                    notify={showLocationDeleted}
                />
            </Grid>
            <Grid item xs={3}>
                <NewUbicationForm
                    nextID={nextID}
                    globalLat={globalLat}
                    globalLng={globalLng}
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
        </Grid>
    );
}

export default MapView;
