import Button from '@mui/material/Button';
import React, { MutableRefObject, useState } from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { IPMarker } from "../../../shared/SharedTypes";
import { Slide, Stack, TextField, Select, MenuItem } from '@mui/material';
import { PowerInputSharp } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

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
  notify: () => void;
}

const NewUbicationForm: React.FC<INewUbicationFormProps> = (props) => {
  const { session } = useSession();
  const { t } = useTranslation("translation");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    props.addMarker({
      id: props.nextID.current, date: new Date(), name: props.globalName, description: props.globalDescription,
      lat: props.globalLat, lng: props.globalLng, category: props.globalCategory, isPublic: false,
      address: props.globalAddress, ratings: [], comments: [], webId: session.info.webId!
    });

    props.setAcceptedMarker(true);

    restartForm();
  }

  const restartForm = () => {
    props.setGlobalName('');
    props.setGlobalDescription('');
    props.setFormOpened(false);
    props.setGlobalLat(0);
    props.setGlobalLng(0);
    props.notify();
  }

  return (
    <>
      <Slide direction="left" in={props.formOpened} >
        <form name="newUbication" onSubmit={handleSubmit}>
          <Stack alignItems="right" sx={{ margin: 2 }}>
            <TextField
              required
              type='number'
              name="latitude"
              label={t("NewUbication.latitud")}
              variant='filled'
              value={props.globalLat}
              onChange={e => props.setGlobalLat(e.target.value as unknown as number)}
              sx={{ marginBottom: '1em', bgcolor: 'white' }}
            />
            <TextField
              required
              type='number'
              name="longitude"
              label={t("NewUbication.longitud")}
              variant='filled'
              value={props.globalLng}
              onChange={e => props.setGlobalLng(e.target.value as unknown as number)}
              sx={{ my: 2, bgcolor: 'white' }}
            />
            <TextField
              required
              id="prueba"
              name="name"
              label={t("NewUbication.name")}
              variant='filled'
              value={props.globalName}
              onChange={e => props.setGlobalName(e.target.value)}
              sx={{ my: 2, bgcolor: 'white' }}
            />
            <TextField
              required
              name="description"
              label={t("NewUbication.descp")}
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
              <MenuItem value={'Museos'}>{t("NewUbication.museo")}</MenuItem>
              <MenuItem value={'Parques'}>{t("NewUbication.parks")}</MenuItem>
              <MenuItem value={'Tiendas'}>{t("NewUbication.shops")}</MenuItem>
              <MenuItem value={'Edificios'}>{t("NewUbication.build")}</MenuItem>
              <MenuItem value={'Farmacias'}>{t("NewUbication.pharm")}</MenuItem>
              <MenuItem value={'Transporte'}>{t("NewUbication.transp")}</MenuItem>
              <MenuItem value={'Restaurantes'}>{t("NewUbication.rest")}</MenuItem>
              <MenuItem value={'Entretenimiento'}>{t("NewUbication.entret")}</MenuItem>
            </Select>
            <Button variant="outlined" type="submit" sx={{ my: 2, color:'lightblue', border: '2px solid' }}>{t("NewUbication.acept")}</Button>
            <Button variant="outlined" onClick={() => props.setFormOpened(false)} sx={{ my: 2, color:'lightblue', border: '2px solid' }}>{t("NewUbication.cancel")}</Button>
          </Stack>
        </form>
      </Slide>
    </>
  );
}

export default NewUbicationForm;
