import Button from '@mui/material/Button';
import React, { MutableRefObject } from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { IPMarker } from "../../../shared/SharedTypes";
import { Slide, Stack, TextField, Select, MenuItem } from '@mui/material'

interface INewUbicationFormProps {
  globalLat: number;
  globalLng: number;
  globalName: string;
  formOpened: boolean;
  globalAddress: string;
  globalCategory: string;
  globalDescription: string;
  nextID: MutableRefObject<string>;
  addMarker: (marker: IPMarker) => void;
  setGlobalLat: (globalLat: number) => void;
  setGlobalLng: (globalLng: number) => void;
  setGlobalName: (globalName: string) => void;
  setFormOpened: (formOpened: boolean) => void;
  setGlobalDescription: (globalName: string) => void;
  setGlobalCategory: (globalCategory: string) => void;
  setAcceptedMarker: (acceptedMarker: boolean) => void;
}

const NewUbicationForm: React.FC<INewUbicationFormProps> = (props) => {
  const { session } = useSession();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    props.addMarker({
      id: props.nextID.current, date: new Date(), name: props.globalName, description: props.globalDescription,
      lat: props.globalLat, lng: props.globalLng, category: props.globalCategory, isPublic: false,
      address: props.globalAddress, ratings: [], comments: [], webId: session.info.webId!
    });

    props.setAcceptedMarker(true);
  }

  return (
    <>
      <Slide direction="left" in={props.formOpened} mountOnEnter unmountOnExit >
        <form name="newUbication" onSubmit={handleSubmit}>
          <Stack alignItems="right" sx={{ margin: 2 }}>
            <TextField
              required
              type='number'
              name="latitude"
              label="Latitud"
              variant='filled'
              value={props.globalLat}
              onChange={e => props.setGlobalLat(e.target.value as unknown as number)}
              sx={{ marginBottom: '1em', bgcolor: 'white' }}
            />
            <TextField
              required
              type='number'
              name="longitude"
              label="Longitud"
              variant='filled'
              value={props.globalLng}
              onChange={e => props.setGlobalLng(e.target.value as unknown as number)}
              sx={{ my: 2, bgcolor: 'white' }}
            />
            <TextField
              required
              name="name"
              label="Nombre"
              variant='filled'
              value={props.globalName}
              onChange={e => props.setGlobalName(e.target.value)}
              sx={{ my: 2, bgcolor: 'white' }}
            />
            <TextField
              required
              name="description"
              label="Descripción"
              variant='filled'
              value={props.globalDescription}
              onChange={e => props.setGlobalDescription(e.target.value)}
              sx={{ my: 2, bgcolor: 'white' }}
            />
            <Select
              value={props.globalCategory}
              onChange={(e) => props.setGlobalCategory(e.target.value as string)}
              sx={{ my: 2, bgcolor: 'white' }}
            >
              <MenuItem value={'Museos'}>Museos</MenuItem>
              <MenuItem value={'Parques'}>Parques</MenuItem>
              <MenuItem value={'Tiendas'}>Tiendas</MenuItem>
              <MenuItem value={'Edificios'}>Edificios</MenuItem>
              <MenuItem value={'Farmacias'}>Farmacias</MenuItem>
              <MenuItem value={'Transporte'}>Transporte</MenuItem>
              <MenuItem value={'Restaurantes'}>Restaurantes</MenuItem>
              <MenuItem value={'Entretenimiento'}>Entretenimiento</MenuItem>
            </Select>
            <Button variant="contained" type="submit" sx={{ my: 2 }}>Aceptar</Button>
            <Button variant="contained" onClick={() => props.setFormOpened(false)} sx={{ my: 2 }}>Cancelar</Button>
          </Stack>
        </form>
      </Slide>
    </>
  );
}

export default NewUbicationForm;
