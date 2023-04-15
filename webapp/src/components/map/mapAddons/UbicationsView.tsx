import { useContext } from 'react';
import { Grid, Box, Button } from '@mui/material';
import { useSession } from '@inrupt/solid-ui-react';
import { IPMarker } from "../../../shared/SharedTypes";
import { MarkerContext, Types } from '../../../context/MarkerContextProvider';

const UbicationsView = () => {
    const { session } = useSession();
    const { state: markers, dispatch } = useContext(MarkerContext);

    const getMyUbications = () => {
        if (session.info.isLoggedIn) {
            return markers.filter((marker) => marker.webId === session.info.webId!);
        }
        return [];
    }

    const deleteMarker = (id: string) => {
        dispatch({ type: Types.DELETE_MARKER, payload: { id: id } });
    }
    
    return (
        <>
            {
                getMyUbications().length > 0 ?
                    (
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ padding: '2em' }}>
                            {
                                getMyUbications().map((ubication: IPMarker) =>
                                    <Grid item xs={6} sm={4} md={3} key={ubication.id}>
                                        <Box sx={{ padding: '1em', bgcolor: 'white', border: 'solid', borderRadius: '2em' }}>
                                            <h1 style={{ marginTop: '0em' }}>{ubication.name}</h1>
                                            <p style={{ marginTop: '0em' }}>Dirección: {ubication.address}</p>
                                            <p>Categoría: {ubication.category}</p>
                                            <p>Descripción: {ubication.description}</p>
                                            <Button sx={{ bgcolor: 'lightgray', color: 'black'}} onClick={() => deleteMarker(ubication.id)}>Borrar</Button>
                                        </Box>                                        
                                    </Grid>
                                )
                            }
                        </Grid>
                    )
                    :
                    (
                        <h1 style={{ color: 'white', textAlign: 'center' }}>Aún no has creado ninguna ubicación</h1>
                    )
            }
        </>
    );
}

export default UbicationsView;

