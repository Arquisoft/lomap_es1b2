import { Close } from '@mui/icons-material';
import { useSession } from '@inrupt/solid-ui-react';
import { IPMarker } from "../../../shared/SharedTypes";
import React, { useContext, useEffect, useState } from 'react';
import { MarkerContext, Types } from '../../../context/MarkerContextProvider';
import { deletePublicMarker, savePublicMarker } from '../../../helpers/SolidHelper';
import { Slide, Stack, TextField, Dialog, Rating, Button, IconButton, FormGroup, Switch, FormControlLabel, Input } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface DetailedUbicationViewProps {
  markerShown: IPMarker;
  isDetailedIWOpen: boolean;
  setMarkerShown: (detailedMarker: IPMarker) => void;
  setDetailedIWOpen: (detailedMarkerOpened: boolean) => void;
}

const DetailedUbicationView: React.FC<DetailedUbicationViewProps> = (props) => {
  const { session } = useSession();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isPublic, setPublic] = useState<boolean>(false);
  const { state: markers, dispatch } = useContext(MarkerContext);
  const [isRatingOpen, setRatingOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File |  null>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let marker = markers.find(marker => marker.id = props.markerShown.id)!;
    marker.ratings.push(rating);
    marker.comments.push(comment);

    dispatch({ type: Types.UPDATE_MARKER, payload: { id: marker.id, marker: marker } });
    if (marker.webId !== session.info.webId!) {
      await savePublicMarker(marker, marker.webId);
    }

    restartValoration();
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };
  

  const { t } = useTranslation("translation");

  const restartValoration = () => {
    setRatingOpen(false);
    setComment('');
    setRating(0);
  }

  const getRatingMean = () => {
    let sum = props.markerShown.ratings
      .map(n => parseInt(n.toString()))
      .reduce((previous, current) => current += previous, 0);
    let total = props.markerShown.ratings.length;
    let result = sum / total;

    return result;
  }

  useEffect(() => {
    setPublic(props.markerShown.isPublic);
  }, [props.markerShown]);

  useEffect(() => {
    let id = props.markerShown.id;

    if (id !== "") {
      let marker = markers.find(marker => marker.id = id)!;

      marker.isPublic = isPublic;
      if (isPublic) {
        savePublicMarker(marker, session.info.webId!);
      } else {
        deletePublicMarker(marker, session.info.webId!);
      }
      dispatch({ type: Types.UPDATE_MARKER, payload: { id: marker.id, marker: marker } });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPublic]);

  return (
    <>
      <Slide style={{ color: 'white' }} direction="right" in={props.isDetailedIWOpen} mountOnEnter unmountOnExit>
        <Stack alignItems="right" sx={{ margin: 2, display: props.isDetailedIWOpen ? '' : 'none' }}>
          <Stack direction='row'>
            <h1 style={{ marginTop: '0em' }}>{props.markerShown.name}</h1>
            <IconButton sx={{ marginLeft: 'auto', marginRight: '0em' }} onClick={async () => props.setDetailedIWOpen(false)}><Close /></IconButton>
          </Stack>
          <p style={{ marginTop: '0em' }}><strong>{t("DetailedInfo.dir")}</strong>{props.markerShown.address}</p>
          <p><strong>{t("DetailedInfo.cat")}</strong>{props.markerShown.category}</p>
          <p><strong>{t("DetailedInfo.descp")}</strong>{props.markerShown.description}</p>
          {props.markerShown.webId === session.info.webId
            &&
            <FormGroup>
              <FormControlLabel control={
                <Switch
                  checked={isPublic}
                  inputProps={{ 'aria-label': 'controlled' }}
                  onChange={e => setPublic(e.target.checked)}
                />
              }
                sx={{ color: 'white', my: 2 }} label={t("DetailedInfo.share")} />
            </FormGroup>
          }
          <h2>{t("DetailedInfo.summary")}</h2>
          <Rating value={getRatingMean()} readOnly />
          <ul>
            {props.markerShown.comments.map(comment =>
              <li key={comment}>{comment}</li>
            )}
          </ul>
          <Button variant="outlined" sx={{ my: 2, color:'lightblue', border: '2px solid' }} onClick={() => setRatingOpen(true)}>{t("DetailedInfo.write")}</Button>
          <Dialog onClose={() => setRatingOpen(false)} open={isRatingOpen}>
            <form name="newRating" onSubmit={handleSubmit}>
              <Stack direction='column' sx={{ width: '30em', padding: '1em' }}>
                <Stack direction='row'>
                  <h1 style={{ margin: '0' }}>{t("DetailedInfo.rate")}</h1>
                  <IconButton sx={{ marginLeft: 'auto', marginRight: '0em' }} onClick={async () => setRatingOpen(false)}><Close /></IconButton>
                </Stack>
                <Rating
                  value={rating}
                  name="rating"
                  sx={{ margin: '0.5em 0em 0.5em' }}
                  onChange={(_, value) => setRating(value as unknown as number)}
                />
                <TextField
                  rows={4}
                  required
                  multiline
                  value={comment}
                  name="comment"
                  label={t("DetailedInfo.comment")}
                  onChange={(e) => setComment(e.target.value as string)}
                  sx={{ margin: '0.5em 0em 0.5em' }}
                />
                <Input
                  type='file'
                  // DO-IT HERE
                 />
                <Button variant="contained" type="submit" sx={{ marginTop: '0.5em', color:'lightblue', border: '2px solid' }}>{t("DetailedInfo.acept")}</Button>
              </Stack>
            </form>
          </Dialog>
        </Stack>
      </Slide>
    </>
  );
}

export default DetailedUbicationView;
