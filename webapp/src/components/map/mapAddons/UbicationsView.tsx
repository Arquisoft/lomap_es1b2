import React, { useContext } from 'react';
import { Grid, Box, Button } from '@mui/material';
import { useSession } from '@inrupt/solid-ui-react';
import { IPMarker } from "../../../shared/SharedTypes";
import { MarkerContext, Types } from '../../../context/MarkerContextProvider';
import { notify } from 'reapop';
import { useTranslation } from 'react-i18next';

type UbicationProps = {
    myMarkers?: IPMarker[];
    opt?: boolean;
}

const UbicationsView = (props: UbicationProps) => {
    const { session } = useSession();
    const { state: markers, dispatch } = useContext(MarkerContext);

    const { t } = useTranslation("translation");

    const getMyUbications = () => {
        if (session.info.isLoggedIn) {
            return markers.filter((marker) => marker.webId === session.info.webId!);
        }
        return [];
    }

    const ubications = (props.myMarkers === undefined) ? getMyUbications() : props.myMarkers;

    const deleteMarker = (id: string) => {
        dispatch({ type: Types.DELETE_MARKER, payload: { id: id } });
        notify(t("Notifications.okUbi"), "success");
    }
    
    return (
        <>
            {
                ubications.length > 0 ?
                    (
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ padding: '2em' }}>
                            {
                                ubications.map((ubication: IPMarker) =>
                                    <Grid item xs={6} sm={4} md={3} key={ubication.id}>
                                        <Box 
                                        sx={{ padding: '1em', 
                                              bgcolor: 'white', 
                                              border: 'solid', 
                                              borderRadius: '1em',
                                              color: 'black'  }}
                                        >
                                            <h1 style={{ marginTop: '0em' }}>{ubication.name}</h1>
                                            <p style={{ marginTop: '0em' }}> <strong>{t("UbicationsView.dir")}</strong> {ubication.address}</p>
                                            <p><strong>{t("UbicationsView.cat")}</strong> {ubication.category}</p>
                                            <p><strong>{t("UbicationsView.descp")}</strong> {ubication.description}</p>
                                            <Button 
                                                variant='contained'
                                                sx={{ 
                                                    bgcolor: 'lightgray', 
                                                    color: 'black', 
                                                    fontWeight: 'bold', 
                                                    left: '0%',
                                                    possition: 'absolute',
                                                    bottom: '0',                                                   
                                                    marginLeft: '-100',
                                                    ":hover": {
                                                        bgcolor: 'lightBlue',
                                                        color: 'black'
                                                    }

                                                }} onClick={() => deleteMarker(ubication.id)}>{
                                                    t("UbicationsView.borrar")}
                                            </Button>
                                        </Box>                                        
                                    </Grid>
                                )
                            }
                        </Grid>
                    )
                    :
                    (
                        <h1 style={{ color: 'white', textAlign: 'center' }}>{t("UbicationsView.notyet")}</h1>
                    )
            }
        </>
    );
}

export default UbicationsView;

